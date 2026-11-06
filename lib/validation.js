import { MAX_FILE_BYTES, MAX_JOB_CHARS, MAX_RESUME_CHARS, formatBytes } from "./limits";

const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46]; // "%PDF"
const ZIP_MAGIC = [0x50, 0x4b, 0x03, 0x04]; // "PK\x03\x04" — DOCX is a zip container

function startsWith(bytes, magic) {
    return magic.every((byte, i) => bytes[i] === byte);
}

/**
 * Identifies the upload by its content, not its declared MIME type, which the client controls.
 * Returns "pdf", "docx" or null.
 */
export function detectFileKind(bytes, fileName = "") {
    if (startsWith(bytes, PDF_MAGIC)) return "pdf";
    if (startsWith(bytes, ZIP_MAGIC) && fileName.toLowerCase().endsWith(".docx")) return "docx";
    return null;
}

/** Client-side pre-check by name/type so users get instant feedback before uploading. */
export function checkSelectedFile(file) {
    if (!file) return null;
    const name = file.name.toLowerCase();
    if (!name.endsWith(".pdf") && !name.endsWith(".docx")) {
        return "Upload a PDF or Word (.docx) file.";
    }
    if (file.size > MAX_FILE_BYTES) {
        return `This file is ${formatBytes(file.size)}. The limit is ${formatBytes(MAX_FILE_BYTES)}.`;
    }
    return null;
}

/** Validates the analyze form before submit. Returns an object of field → message (empty when valid). */
export function validateForm({ mode, resumeText, file, jobDescription }) {
    const errors = {};

    if (mode === "paste") {
        if (!resumeText.trim()) errors.resume = "Paste your resume text, or switch to Upload file.";
        else if (resumeText.length > MAX_RESUME_CHARS)
            errors.resume = `Shorten your resume to ${MAX_RESUME_CHARS.toLocaleString()} characters or fewer.`;
    } else if (!file) {
        errors.file = "Choose a PDF or Word file to upload.";
    } else {
        const fileError = checkSelectedFile(file);
        if (fileError) errors.file = fileError;
    }

    if (jobDescription.length > MAX_JOB_CHARS) {
        errors.jobDescription = `Shorten the job description to ${MAX_JOB_CHARS.toLocaleString()} characters or fewer.`;
    }

    return errors;
}

export function checkTextLengths({ resumeText = "", jobDescription = "" }) {
    if (resumeText.length > MAX_RESUME_CHARS) {
        return `Resume text is too long (${resumeText.length.toLocaleString()} characters). The limit is ${MAX_RESUME_CHARS.toLocaleString()}.`;
    }
    if (jobDescription.length > MAX_JOB_CHARS) {
        return `Job description is too long (${jobDescription.length.toLocaleString()} characters). The limit is ${MAX_JOB_CHARS.toLocaleString()}.`;
    }
    return null;
}
