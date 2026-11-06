import { GoogleGenAI } from "@google/genai";
import { buildResponseSchema, buildSystemInstruction, buildUserContent } from "./analysisPrompt";
import { normalizeAnalysis } from "./normalizeAnalysis";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

export class AnalysisError extends Error {
    constructor(code, message) {
        super(message);
        this.name = "AnalysisError";
        this.code = code;
    }
}

let client;

function getClient() {
    if (!client) {
        if (!process.env.GEMINI_API_KEY) {
            throw new AnalysisError("config", "The server is missing its Gemini API key.");
        }
        client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return client;
}

/**
 * @param {{ resumeText?: string, pdfBase64?: string }} resume — exactly one of the two
 * @param {string} jobDescription — may be empty
 */
export async function analyzeResume({ resumeText, pdfBase64 }, jobDescription = "") {
    const hasJobDescription = Boolean(jobDescription.trim());
    const parts = [{ text: buildUserContent({ resumeText, jobDescription: jobDescription.trim() }) }];
    if (pdfBase64) parts.push({ inlineData: { mimeType: "application/pdf", data: pdfBase64 } });

    let response;
    try {
        response = await getClient().models.generateContent({
            model: MODEL,
            contents: [{ role: "user", parts }],
            config: {
                systemInstruction: buildSystemInstruction(new Date().toISOString().slice(0, 10)),
                responseMimeType: "application/json",
                responseSchema: buildResponseSchema(hasJobDescription),
                temperature: 0.4,
            },
        });
    } catch (err) {
        if (err?.status === 429) {
            throw new AnalysisError("busy", "The AI service is at its limit right now. Wait a minute and try again.");
        }
        throw err;
    }

    const text = response.text;
    if (!text) {
        throw new AnalysisError(
            "no_output",
            "The AI couldn't analyze this resume. If you uploaded a scanned file, try pasting the text instead.",
        );
    }

    try {
        return normalizeAnalysis(JSON.parse(text), { hasJobDescription });
    } catch {
        throw new AnalysisError("bad_output", "The AI returned an unreadable result. Please try again.");
    }
}
