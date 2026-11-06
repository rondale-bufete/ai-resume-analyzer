function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Splits text into segments, tagging occurrences of matching/missing keywords so the UI can
 * highlight them. Case-insensitive; longer terms win over terms they contain ("React Native"
 * over "React"); boundaries are alphanumeric so terms like "C++" and "Node.js" still match.
 *
 * @returns {{ text: string, kind: "match" | "missing" | null }[]}
 */
export function highlightKeywords(text, { matching = [], missing = [] }) {
    const kindByTerm = new Map();
    for (const term of missing) kindByTerm.set(term.toLowerCase(), "missing");
    for (const term of matching) kindByTerm.set(term.toLowerCase(), "match");

    const terms = [...kindByTerm.keys()].filter(Boolean).sort((a, b) => b.length - a.length);
    if (!text || terms.length === 0) return [{ text: text ?? "", kind: null }];

    const pattern = new RegExp(`(?<![A-Za-z0-9])(${terms.map(escapeRegExp).join("|")})(?![A-Za-z0-9])`, "gi");
    const segments = [];
    let cursor = 0;

    for (const match of text.matchAll(pattern)) {
        if (match.index > cursor) segments.push({ text: text.slice(cursor, match.index), kind: null });
        segments.push({ text: match[0], kind: kindByTerm.get(match[0].toLowerCase()) });
        cursor = match.index + match[0].length;
    }

    if (cursor < text.length) segments.push({ text: text.slice(cursor), kind: null });
    return segments;
}
