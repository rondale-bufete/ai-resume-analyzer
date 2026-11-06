// Shared by the client form and the API route so both enforce the same caps.
// Vercel rejects request bodies over 4.5 MB, so the file cap stays below that.
export const MAX_FILE_BYTES = 4 * 1024 * 1024;
export const MAX_RESUME_CHARS = 20_000;
export const MAX_JOB_CHARS = 10_000;

export const ACCEPTED_FILE_TYPES = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export const ACCEPT_ATTRIBUTE = `${ACCEPTED_FILE_TYPES.pdf},${ACCEPTED_FILE_TYPES.docx},.pdf,.docx`;

export function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
