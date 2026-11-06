import { NextResponse } from "next/server";
import { AnalysisError, analyzeResume } from "@/lib/gemini";
import { extractDocxText } from "@/lib/extractDocx";
import { MAX_FILE_BYTES, MAX_RESUME_CHARS, formatBytes } from "@/lib/limits";
import { createRateLimiter } from "@/lib/rateLimit";
import { checkTextLengths, detectFileKind } from "@/lib/validation";

export const maxDuration = 60;

// Multipart overhead plus the text fields on top of the file itself.
const MAX_REQUEST_BYTES = MAX_FILE_BYTES + 256 * 1024;

const checkRateLimit = createRateLimiter({ limit: 5, windowMs: 60_000 });

const ERROR_STATUS = { busy: 429, no_output: 422, bad_output: 502, config: 500 };

function errorResponse(status, code, message, headers) {
    return NextResponse.json({ error: message, code }, { status, headers });
}

function clientIp(request) {
    const forwarded = request.headers.get("x-forwarded-for");
    return forwarded?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
}

function asText(value) {
    return typeof value === "string" ? value : "";
}

async function readResume({ resumeFile, resumeText }) {
    if (resumeFile && typeof resumeFile === "object" && resumeFile.size > 0) {
        if (resumeFile.size > MAX_FILE_BYTES) {
            return { error: [413, "file_too_large", `Files must be under ${formatBytes(MAX_FILE_BYTES)}.`] };
        }

        const bytes = new Uint8Array(await resumeFile.arrayBuffer());
        const kind = detectFileKind(bytes, resumeFile.name);

        if (kind === "pdf") return { resume: { pdfBase64: Buffer.from(bytes).toString("base64") } };

        if (kind === "docx") {
            let text = "";
            try {
                text = await extractDocxText(bytes);
            } catch {
                // Falls through to the "no text" error below.
            }
            if (!text) return { error: [422, "unreadable_file", "We couldn't read any text from this Word file."] };
            return { resume: { resumeText: text.slice(0, MAX_RESUME_CHARS) } };
        }

        return { error: [415, "unsupported_file", "Upload a PDF or Word (.docx) file."] };
    }

    if (resumeText.trim()) return { resume: { resumeText: resumeText.trim() } };

    return { error: [400, "missing_resume", "Paste your resume text or upload a file."] };
}

export async function POST(request) {
    const rate = checkRateLimit(clientIp(request));
    if (!rate.allowed) {
        return errorResponse(
            429,
            "rate_limited",
            `You've run several analyses in a row. Try again in ${rate.retryAfterSeconds} seconds.`,
            { "Retry-After": String(rate.retryAfterSeconds) },
        );
    }

    if (Number(request.headers.get("content-length") ?? 0) > MAX_REQUEST_BYTES) {
        return errorResponse(413, "file_too_large", `Files must be under ${formatBytes(MAX_FILE_BYTES)}.`);
    }

    let formData;
    try {
        formData = await request.formData();
    } catch {
        return errorResponse(400, "bad_request", "The form data couldn't be read. Please try again.");
    }

    const jobDescription = asText(formData.get("jobDescription"));
    const resumeText = asText(formData.get("resumeText"));

    const lengthError = checkTextLengths({ resumeText, jobDescription });
    if (lengthError) return errorResponse(400, "too_long", lengthError);

    try {
        const { resume, error } = await readResume({ resumeFile: formData.get("resumeFile"), resumeText });
        if (error) return errorResponse(...error);

        const result = await analyzeResume(resume, jobDescription);
        return NextResponse.json({ result });
    } catch (err) {
        if (err instanceof AnalysisError) {
            if (err.code === "config") console.error(err.message);
            return errorResponse(ERROR_STATUS[err.code] ?? 500, err.code, err.message);
        }
        console.error("Resume analysis failed:", err);
        return errorResponse(500, "server_error", "Analysis failed. Please try again.");
    }
}
