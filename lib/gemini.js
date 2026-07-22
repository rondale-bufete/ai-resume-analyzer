import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        overallScore: { type: Type.INTEGER, description: "Overall resume quality, 0-100" },
        summary: { type: Type.STRING, description: "2-3 sentence overall assessment" },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        atsIssues: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Formatting or structural issues that could confuse ATS (applicant tracking system) parsing",
        },
        sections: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "e.g. 'Work Experience', 'Skills', 'Summary'" },
                    feedback: { type: Type.STRING },
                },
                required: ["name", "feedback"],
            },
        },
        rewriteSuggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    original: { type: Type.STRING, description: "A weak line/bullet quoted from the resume" },
                    suggested: { type: Type.STRING, description: "A stronger rewrite of that line" },
                    reason: { type: Type.STRING, description: "Why the rewrite is better" },
                },
                required: ["original", "suggested", "reason"],
            },
        },
        jobMatch: {
            type: Type.OBJECT,
            nullable: true,
            properties: {
                matchScore: { type: Type.INTEGER, description: "0-100, how well the resume matches the job description" },
                matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                notes: { type: Type.STRING },
            },
        },
    },
    required: ["overallScore", "summary", "strengths", "weaknesses", "atsIssues", "sections", "rewriteSuggestions"],
};

function buildPrompt(jobDescription) {
    let prompt = `You are an expert resume reviewer and career coach. Analyze the attached/provided resume thoroughly.

Evaluate:
- Overall quality, clarity, and impact
- Strengths and weaknesses
- ATS (applicant tracking system) formatting risks — things like tables, unusual fonts, missing keywords, graphics, or non-standard section headers that could cause parsing issues
- Section-by-section feedback (e.g. Summary, Experience, Skills, Education — only include sections that actually exist in the resume)
- 3-5 specific weak bullet points, each with a stronger rewritten version and why it's better. Quote the original text exactly as it appears.
- You have inaccurate date information, so do not make assumptions about dates or timelines (e.g., future dates). Focus on the content and structure of the resume itself.

Be honest and specific — avoid generic advice like "add more detail." Reference actual content from the resume.`;

    if (jobDescription && jobDescription.trim()) {
        prompt += `\n\nAdditionally, compare this resume against the following job description. Give a match score (0-100), list matching skills/keywords found in both, list important skills from the job description missing from the resume, and add brief notes on how to improve alignment.\n\nJOB DESCRIPTION:\n${jobDescription}`;
    }

    return prompt;
}

export async function analyzeResumeText(resumeText, jobDescription) {
    const prompt = buildPrompt(jobDescription);

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ text: `${prompt}\n\nRESUME TEXT:\n${resumeText}` }],
        config: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
        },
    });

    return JSON.parse(response.text);
}

export async function analyzeResumePdf(base64Pdf, jobDescription) {
    const prompt = buildPrompt(jobDescription);

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
            {
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: "application/pdf", data: base64Pdf } },
                ],
            },
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
        },
    });

    return JSON.parse(response.text);
}