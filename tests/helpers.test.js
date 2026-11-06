import { describe, expect, it } from "vitest";
import { addHistoryEntry, findPreviousRun, parseHistory, resumeLabel } from "@/lib/history";
import { highlightKeywords } from "@/lib/keywords";
import { createRateLimiter } from "@/lib/rateLimit";
import { applyRewrite, canApplyRewrite } from "@/lib/rewrites";

describe("createRateLimiter", () => {
    it("blocks after the limit and frees up once the window passes", () => {
        let time = 0;
        const check = createRateLimiter({ limit: 2, windowMs: 1000, now: () => time });

        expect(check("ip").allowed).toBe(true);
        expect(check("ip").allowed).toBe(true);
        const blocked = check("ip");
        expect(blocked.allowed).toBe(false);
        expect(blocked.retryAfterSeconds).toBe(1);
        expect(check("other-ip").allowed).toBe(true);

        time = 1001;
        expect(check("ip").allowed).toBe(true);
    });
});

describe("highlightKeywords", () => {
    it("tags matching and missing terms, preferring longer terms", () => {
        const segments = highlightKeywords("We need React Native, react and Node.js skills.", {
            matching: ["React"],
            missing: ["React Native", "Node.js"],
        });
        const marked = segments.filter((s) => s.kind).map((s) => [s.text, s.kind]);
        expect(marked).toEqual([
            ["React Native", "missing"],
            ["react", "match"],
            ["Node.js", "missing"],
        ]);
        expect(segments.map((s) => s.text).join("")).toBe("We need React Native, react and Node.js skills.");
    });

    it("does not match inside other words", () => {
        const segments = highlightKeywords("Javascript experts", { matching: ["Java"] });
        expect(segments.some((s) => s.kind)).toBe(false);
    });

    it("handles symbols such as C++", () => {
        const segments = highlightKeywords("Strong C++ background", { missing: ["C++"] });
        expect(segments.find((s) => s.kind)?.text).toBe("C++");
    });
});

describe("applyRewrite", () => {
    const resume = "EXPERIENCE\n- Worked on the company website using React\n- Fixed bugs";

    it("replaces the exact original line", () => {
        const next = applyRewrite(resume, "Worked on the company website using React", "Rebuilt the site in React");
        expect(next).toContain("- Rebuilt the site in React");
        expect(next).not.toContain("Worked on");
    });

    it("tolerates whitespace differences in the quoted text", () => {
        expect(canApplyRewrite(resume, "Worked on the  company\nwebsite using React")).toBe(true);
    });

    it("leaves text unchanged when the original isn't found", () => {
        expect(applyRewrite(resume, "Not in resume", "x")).toBe(resume);
        expect(canApplyRewrite(resume, "Not in resume")).toBe(false);
    });
});

describe("history helpers", () => {
    it("adds newest first, removes duplicates and caps the list", () => {
        let list = [];
        for (let i = 1; i <= 7; i++) list = addHistoryEntry(list, { id: String(i), result: {} }, 5);
        expect(list.map((e) => e.id)).toEqual(["7", "6", "5", "4", "3"]);
    });

    it("finds the latest earlier run of the same resume", () => {
        const list = [
            { id: "b", label: "Jane Doe", overallScore: 70 },
            { id: "a", label: "Jane Doe", overallScore: 60 },
        ];
        expect(findPreviousRun(list, "Jane Doe").id).toBe("b");
        expect(findPreviousRun(list, "Other")).toBeNull();
    });

    it("ignores corrupt storage", () => {
        expect(parseHistory("{not json")).toEqual([]);
        expect(parseHistory('[{"id":"1"}]')).toEqual([]);
    });

    it("labels resumes by file name or first line", () => {
        expect(resumeLabel({ file: { name: "cv.pdf" }, resumeText: "" })).toBe("cv.pdf");
        expect(resumeLabel({ file: null, resumeText: "\n  Jane Doe\nDev" })).toBe("Jane Doe");
    });
});
