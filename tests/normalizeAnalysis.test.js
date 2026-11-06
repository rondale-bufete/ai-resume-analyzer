import { describe, expect, it } from "vitest";
import { normalizeAnalysis } from "@/lib/normalizeAnalysis";

describe("normalizeAnalysis", () => {
    it("clamps scores and fills missing fields with safe defaults", () => {
        const result = normalizeAnalysis({ overallScore: 140, scoreBreakdown: { impact: -5, clarity: "72.6" } }, {
            hasJobDescription: false,
        });

        expect(result.overallScore).toBe(100);
        expect(result.scoreBreakdown).toEqual({ impact: 0, clarity: 73, atsFormatting: 0, keywords: 0 });
        expect(result.strengths).toEqual([]);
        expect(result.rewriteSuggestions).toEqual([]);
    });

    it("drops the job match when no job description was given", () => {
        const result = normalizeAnalysis({ jobMatch: { matchScore: 80 } }, { hasJobDescription: false });
        expect(result.jobMatch).toBeNull();
    });

    it("keeps the job match and de-duplicates skills case-insensitively", () => {
        const result = normalizeAnalysis(
            { jobMatch: { matchScore: 64, matchingSkills: ["React", "react", " Git "], missingSkills: [] } },
            { hasJobDescription: true },
        );
        expect(result.jobMatch.matchingSkills).toEqual(["React", "Git"]);
        expect(result.jobMatch.matchScore).toBe(64);
    });

    it("sorts ATS issues by severity and accepts legacy string issues", () => {
        const result = normalizeAnalysis(
            {
                atsIssues: [
                    { issue: "Minor spacing", severity: "low" },
                    "Uses a two-column layout",
                    { issue: "Contact info in header", severity: "high" },
                    { issue: "", severity: "high" },
                ],
            },
            { hasJobDescription: false },
        );
        expect(result.atsIssues.map((i) => i.severity)).toEqual(["high", "medium", "low"]);
        expect(result.atsIssues).toHaveLength(3);
    });

    it("removes incomplete rewrite suggestions", () => {
        const result = normalizeAnalysis(
            {
                rewriteSuggestions: [
                    { original: "Did stuff", suggested: "Shipped X", reason: "Specific" },
                    { original: "Missing reason", suggested: "…" },
                ],
            },
            { hasJobDescription: false },
        );
        expect(result.rewriteSuggestions).toHaveLength(1);
    });

    it("survives non-object input", () => {
        expect(normalizeAnalysis(null, { hasJobDescription: true }).overallScore).toBe(0);
    });
});
