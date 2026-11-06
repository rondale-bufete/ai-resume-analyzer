const SEVERITY_RANK = { high: 0, medium: 1, low: 2 };

function clampScore(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.min(100, Math.max(0, Math.round(n)));
}

function cleanText(value) {
    return typeof value === "string" ? value.trim() : "";
}

function cleanStrings(value) {
    return Array.isArray(value) ? value.map(cleanText).filter(Boolean) : [];
}

function uniqueCaseInsensitive(items) {
    const seen = new Set();
    return items.filter((item) => {
        const key = item.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function cleanObjects(value, fields) {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => Object.fromEntries(fields.map((field) => [field, cleanText(item?.[field])])))
        .filter((item) => fields.every((field) => item[field]));
}

function cleanAtsIssues(value) {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) =>
            typeof item === "string"
                ? { issue: item.trim(), severity: "medium" }
                : {
                    issue: cleanText(item?.issue),
                    severity: item?.severity in SEVERITY_RANK ? item.severity : "medium",
                },
        )
        .filter((item) => item.issue)
        .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
}

/**
 * Model output is schema-guided but not guaranteed: clamp scores, drop empty items,
 * and only keep a job match when a job description was actually provided.
 */
export function normalizeAnalysis(raw, { hasJobDescription }) {
    const data = raw && typeof raw === "object" ? raw : {};
    const breakdown = data.scoreBreakdown ?? {};
    const job = data.jobMatch;

    return {
        overallScore: clampScore(data.overallScore),
        scoreBreakdown: {
            impact: clampScore(breakdown.impact),
            clarity: clampScore(breakdown.clarity),
            atsFormatting: clampScore(breakdown.atsFormatting),
            keywords: clampScore(breakdown.keywords),
        },
        summary: cleanText(data.summary),
        strengths: cleanStrings(data.strengths),
        weaknesses: cleanStrings(data.weaknesses),
        atsIssues: cleanAtsIssues(data.atsIssues),
        sections: cleanObjects(data.sections, ["name", "feedback"]),
        rewriteSuggestions: cleanObjects(data.rewriteSuggestions, ["original", "suggested", "reason"]),
        jobMatch:
            hasJobDescription && job && typeof job === "object"
                ? {
                    matchScore: clampScore(job.matchScore),
                    matchingSkills: uniqueCaseInsensitive(cleanStrings(job.matchingSkills)),
                    missingSkills: uniqueCaseInsensitive(cleanStrings(job.missingSkills)),
                    notes: cleanText(job.notes),
                    tailoredSummary: cleanText(job.tailoredSummary),
                    coverLetterOpener: cleanText(job.coverLetterOpener),
                }
                : null,
    };
}
