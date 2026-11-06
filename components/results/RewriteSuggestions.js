import { CheckCheck, Wand2 } from "lucide-react";
import CopyButton from "../CopyButton";
import { buttonSecondary, card } from "../ui";

export default function RewriteSuggestions({ suggestions, canApply, appliedIndexes, onApply }) {
    if (suggestions.length === 0) return null;

    return (
        <section aria-labelledby="rewrites-heading">
            <h3 id="rewrites-heading" className="mb-1 text-sm font-medium text-ink">
                Suggested rewrites
            </h3>
            <p className="mb-4 text-xs text-muted print:hidden">
                Apply works on pasted text: the rewrite replaces the original line in your resume box.
            </p>
            <ul className="grid gap-4 md:grid-cols-2">
                {suggestions.map((rewrite, i) => {
                    const applied = appliedIndexes.has(i);
                    const applicable = !applied && canApply(rewrite.original);
                    return (
                        <li key={i} className={`${card} print-avoid-break flex flex-col p-5`}>
                            <div className="mb-3">
                                <p className="mb-1 text-xs text-poor">Original</p>
                                <p className={`text-sm italic text-ink-soft ${applied ? "line-through opacity-70" : ""}`}>
                                    &ldquo;{rewrite.original}&rdquo;
                                </p>
                            </div>
                            <div className="mb-3">
                                <p className="mb-1 text-xs text-accent">Suggested</p>
                                <p className="text-sm text-ink">&ldquo;{rewrite.suggested}&rdquo;</p>
                            </div>
                            <p className="mb-4 text-xs leading-relaxed text-muted">{rewrite.reason}</p>
                            <div className="mt-auto flex flex-wrap gap-2 print:hidden">
                                <CopyButton text={rewrite.suggested} label="Copy rewrite" />
                                {applied ? (
                                    <span className="inline-flex min-h-9 items-center gap-1.5 px-1 text-xs text-accent">
                                        <CheckCheck aria-hidden="true" className="h-3.5 w-3.5" /> Applied
                                    </span>
                                ) : (
                                    applicable && (
                                        <button
                                            type="button"
                                            onClick={() => onApply(i)}
                                            className={`${buttonSecondary} min-h-9 px-3 text-xs`}
                                        >
                                            <Wand2 aria-hidden="true" className="h-3.5 w-3.5" />
                                            Apply to my resume
                                        </button>
                                    )
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
