import { NextResponse } from "next/server";
import { analyzeResumeText, analyzeResumePdf } from "@/lib/gemini";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const jobDescription = formData.get("jobDescription") || "";
        const resumeText = formData.get("resumeText");
        const resumeFile = formData.get("resumeFile");

        let result;

        if (resumeFile && resumeFile.size > 0) {
            const bytes = await resumeFile.arrayBuffer();
            const base64 = Buffer.from(bytes).toString("base64");
            result = await analyzeResumePdf(base64, jobDescription);
        } else if (resumeText && resumeText.trim()) {
            result = await analyzeResumeText(resumeText, jobDescription);
        } else {
            return NextResponse.json({ error: "Provide either resume text or a PDF file" }, { status: 400 });
        }

        return NextResponse.json({ result });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
    }
}