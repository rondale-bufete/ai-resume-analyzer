function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// The model sometimes collapses line breaks or double spaces when quoting, so match on
// the words with flexible whitespace between them.
function flexiblePattern(original) {
    const words = original.trim().split(/\s+/).map(escapeRegExp);
    return new RegExp(words.join("\\s+"));
}

export function findRewriteTarget(resumeText, original) {
    if (!resumeText || !original?.trim()) return null;
    const exact = resumeText.indexOf(original);
    if (exact !== -1) return { index: exact, length: original.length };
    const match = flexiblePattern(original).exec(resumeText);
    return match ? { index: match.index, length: match[0].length } : null;
}

export function canApplyRewrite(resumeText, original) {
    return findRewriteTarget(resumeText, original) !== null;
}

/** Replaces the first occurrence of `original` with `suggested`; returns the text unchanged if not found. */
export function applyRewrite(resumeText, original, suggested) {
    const target = findRewriteTarget(resumeText, original);
    if (!target) return resumeText;
    return resumeText.slice(0, target.index) + suggested + resumeText.slice(target.index + target.length);
}
