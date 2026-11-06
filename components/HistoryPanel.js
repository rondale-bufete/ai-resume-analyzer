import { History, Trash2 } from "lucide-react";
import { scoreTone } from "./ScoreGauge";
import { linkButton } from "./ui";

export default function HistoryPanel({ entries, activeId, onSelect, onClear }) {
    if (entries.length === 0) return null;

    return (
        <section aria-labelledby="history-heading" className="mt-6 print:hidden">
            <div className="mb-2 flex items-center justify-between">
                <h2 id="history-heading" className="flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                    <History aria-hidden="true" className="h-3.5 w-3.5" />
                    Recent analyses
                </h2>
                <button type="button" onClick={onClear} className={`${linkButton} min-h-8 text-xs`}>
                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    Clear history
                </button>
            </div>
            <ul className="space-y-1.5">
                {entries.map((entry) => {
                    const active = entry.id === activeId;
                    return (
                        <li key={entry.id}>
                            <button
                                type="button"
                                onClick={() => onSelect(entry)}
                                aria-current={active ? "true" : undefined}
                                className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${active ? "border-accent/50 bg-accent/[0.06]" : "border-line hover:border-accent/30"
                                    }`}
                            >
                                <span className="min-w-0">
                                    <span className="block truncate text-sm text-ink">{entry.label}</span>
                                    <span className="block text-xs text-muted">{new Date(entry.createdAt).toLocaleString()}</span>
                                </span>
                                <span
                                    className="font-display text-lg tabular-nums"
                                    style={{ color: scoreTone(entry.overallScore).color }}
                                >
                                    {entry.overallScore}
                                    <span className="sr-only"> overall score</span>
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
            <p className="mt-2 text-xs text-muted">Saved only in this browser.</p>
        </section>
    );
}
