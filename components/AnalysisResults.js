import { Pencil, Printer } from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import ScoreBreakdown from "./results/ScoreBreakdown";
import AtsIssues from "./results/AtsIssues";
import JobMatch from "./results/JobMatch";
import RewriteSuggestions from "./results/RewriteSuggestions";
import { buttonSecondary, card, sectionTitle } from "./ui";

function PointList({ title, items, marker, tone }) {
    return (
        <section aria-label={title} className={`${card} print-avoid-break p-5`}>
            <h3 className={`mb-3 text-sm font-medium ${tone}`}>{title}</h3>
            {items.length ? (
                <ul className="space-y-2">
                    {items.map((item, i) => (
                        <li key={i} className="flex gap-2 text-sm text-ink-soft">
                            <span aria-hidden="true" className={`shrink-0 ${tone}`}>
                                {marker}
                            </span>
                            {item}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-muted">Nothing to note.</p>
            )}
        </section>
    );
}

export default function AnalysisResults({
    result,
    meta,
    previousRun,
    jobDescription,
    canApply,
    appliedIndexes,
    onApplyRewrite,
    onEdit,
    headingRef,
}) {
    const { overallScore, scoreBreakdown, summary, strengths, weaknesses, atsIssues, sections, rewriteSuggestions, jobMatch } =
        result;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 ref={headingRef} tabIndex={-1} className="font-display text-xl font-medium tracking-tight outline-none">
                        Resume analysis
                    </h2>
                    <p className="text-xs text-muted">
                        {meta.label} · {new Date(meta.createdAt).toLocaleString()}
                    </p>
                </div>
                <div className="flex gap-2 print:hidden">
                    <button type="button" onClick={onEdit} className={`${buttonSecondary} min-h-10 px-3 text-sm`}>
                        <Pencil aria-hidden="true" className="h-4 w-4" />
                        Edit &amp; re-analyze
                    </button>
                    <button type="button" onClick={() => window.print()} className={`${buttonSecondary} min-h-10 px-3 text-sm`}>
                        <Printer aria-hidden="true" className="h-4 w-4" />
                        Print / Save PDF
                    </button>
                </div>
            </div>

            <section
                aria-label="Scores"
                className={`glow-border ${card} print-avoid-break flex flex-col items-center gap-6 p-6 sm:flex-row`}
            >
                <ScoreGauge score={overallScore} label="Overall score" previousScore={previousRun?.overallScore} />
                {jobMatch && (
                    <ScoreGauge score={jobMatch.matchScore} label="Job match" previousScore={previousRun?.matchScore} />
                )}
                <p className="text-sm leading-relaxed text-ink-soft sm:flex-1">{summary}</p>
            </section>

            <ScoreBreakdown breakdown={scoreBreakdown} />

            <div className="grid gap-6 md:grid-cols-2">
                <PointList title="Strengths" items={strengths} marker="+" tone="text-accent" />
                <PointList title="Weaknesses" items={weaknesses} marker="−" tone="text-fair" />
            </div>

            <AtsIssues issues={atsIssues} />

            {jobMatch && <JobMatch jobMatch={jobMatch} jobDescription={jobDescription} />}

            {sections.length > 0 && (
                <section aria-labelledby="sections-heading" className={`${card} p-5`}>
                    <h3 id="sections-heading" className={`${sectionTitle} mb-4`}>
                        Section-by-section feedback
                    </h3>
                    <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                        {sections.map((section, i) => (
                            <div key={i} className="print-avoid-break border-b border-line pb-4 md:border-0 md:pb-0">
                                <h4 className="mb-1 text-sm font-medium text-accent">{section.name}</h4>
                                <p className="text-sm leading-relaxed text-ink-soft">{section.feedback}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <RewriteSuggestions
                suggestions={rewriteSuggestions}
                canApply={canApply}
                appliedIndexes={appliedIndexes}
                onApply={onApplyRewrite}
            />
        </div>
    );
}
