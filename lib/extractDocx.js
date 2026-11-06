import mammoth from "mammoth";

export async function extractDocxText(bytes) {
    const { value } = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
    // Word exports often leave runs of blank lines; collapse them so the prompt stays compact.
    return value.replace(/\n{3,}/g, "\n\n").trim();
}
