import { describe, expect, it } from "vitest";
import { MAX_FILE_BYTES, MAX_JOB_CHARS, MAX_RESUME_CHARS } from "@/lib/limits";
import { checkSelectedFile, checkTextLengths, detectFileKind, validateForm } from "@/lib/validation";

const bytes = (...values) => new Uint8Array([...values, 0, 0, 0]);

describe("detectFileKind", () => {
    it("recognizes PDFs by their %PDF header regardless of name", () => {
        expect(detectFileKind(bytes(0x25, 0x50, 0x44, 0x46), "resume.txt")).toBe("pdf");
    });

    it("recognizes DOCX only when the zip header and extension agree", () => {
        expect(detectFileKind(bytes(0x50, 0x4b, 0x03, 0x04), "resume.docx")).toBe("docx");
        expect(detectFileKind(bytes(0x50, 0x4b, 0x03, 0x04), "archive.zip")).toBeNull();
    });

    it("rejects files renamed to .pdf", () => {
        expect(detectFileKind(bytes(0x89, 0x50, 0x4e, 0x47), "photo.pdf")).toBeNull();
    });
});

describe("checkSelectedFile", () => {
    it("accepts PDF and DOCX within the size limit", () => {
        expect(checkSelectedFile({ name: "CV.PDF", size: 1000 })).toBeNull();
        expect(checkSelectedFile({ name: "cv.docx", size: 1000 })).toBeNull();
    });

    it("rejects other types and oversized files", () => {
        expect(checkSelectedFile({ name: "cv.doc", size: 1000 })).toMatch(/PDF or Word/);
        expect(checkSelectedFile({ name: "cv.pdf", size: MAX_FILE_BYTES + 1 })).toMatch(/limit/);
    });
});

describe("validateForm", () => {
    const base = { mode: "paste", resumeText: "Jane Doe", file: null, jobDescription: "" };

    it("passes a valid pasted resume", () => {
        expect(validateForm(base)).toEqual({});
    });

    it("requires text in paste mode and a file in upload mode", () => {
        expect(validateForm({ ...base, resumeText: "   " }).resume).toBeTruthy();
        expect(validateForm({ ...base, mode: "upload" }).file).toBeTruthy();
    });

    it("enforces length limits", () => {
        expect(validateForm({ ...base, resumeText: "a".repeat(MAX_RESUME_CHARS + 1) }).resume).toBeTruthy();
        expect(validateForm({ ...base, jobDescription: "a".repeat(MAX_JOB_CHARS + 1) }).jobDescription).toBeTruthy();
    });
});

describe("checkTextLengths", () => {
    it("returns null when within limits", () => {
        expect(checkTextLengths({ resumeText: "ok", jobDescription: "ok" })).toBeNull();
    });
});
