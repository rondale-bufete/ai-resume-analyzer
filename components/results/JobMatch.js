import { highlightKeywords } from "@/lib/keywords";
import CopyButton from "../CopyButton";
import { card, sectionTitle } from "../ui";

function SkillList({ title, skills, className, emptyText }) {
    return (
        <div>
            <h4 className="mb-2 text-xs text-muted">{title}</h4>
            {skills.length ? (
                <ul className="flex flex-wrap gap-1.5">
                    {skills.map((skill, i) => (
                        <li key={`${skill}-${i}`} className={`rounded px-2 py-1 text-xs ${className}`}>
                            {skill}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-xs text-muted">{emptyText}</p>
            )}
        </div>
    );
}

function KeywordMap({ jobDescription, matching, missing }) {
    const segments = highlightKeywords(jobDescription, { matching, missing });
    const hasHighlights = segments.some((segment) => segment.kind);
    if (!hasHighlights) return null;

    return (
        <div className="mt-5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs text-muted">Keyword map of the job description</h4>
                <p className="flex gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1.5">
                        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-accent/40" /> In your resume
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-poor/40" /> Missing
                    </span>
                </p>
            </div>
            <div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-lg border border-line bg-bg p-4 text-sm leading-relaxed text-ink-soft print:max-h-none print:overflow-visible">
                {segments.map((segment, i) =>
                    segment.kind ? (
                        <mark
                            key={i}
                            className={`rounded px-0.5 text-ink ${segment.kind === "match" ? "bg-accent/25" : "bg-poor/25 underline decoration-poor decoration-dotted underline-offset-2"
                                }`}
                        >
                            {segment.text}
                            <span className="sr-only">{segment.kind === "match" ? " (in your resume)" : " (missing)"}</span>
                        </mark>
                    ) : (
                        <span key={i}>{segment.text}</span>
                    ),
                )}
            </div>
        </div>
    );
}

function TailoredBlock({ title, text }) {
    if (!text) return null;
    return (
        <div className="print-avoid-break rounded-lg border border-line bg-bg p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
                <h4 className="text-xs font-medium text-accent">{title}</h4>
                <CopyButton text={text} />
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">{text}</p>
        </div>
    );
}

export default function JobMatch({ jobMatch, jobDescription }) {
    return (
        <section aria-labelledby="job-match-heading" className={`${card} p-5`}>
            <h3 id="job-match-heading" className={`${sectionTitle} mb-4`}>
                Job match detail
            </h3>
            <div className="mb-4 grid gap-4 md:grid-cols-2">
                <SkillList
                    title="Matching skills"
                    skills={jobMatch.matchingSkills}
                    className="bg-accent/15 text-accent-hover print:text-accent"
                    emptyText="No clear overlap found."
                />
                <SkillList
                    title="Missing skills"
                    skills={jobMatch.missingSkills}
                    className="bg-poor/15 text-poor"
                    emptyText="Nothing important missing."
                />
            </div>
            {jobMatch.notes && <p className="text-sm leading-relaxed text-ink-soft">{jobMatch.notes}</p>}

            {jobDescription && (
                <KeywordMap
                    jobDescription={jobDescription}
                    matching={jobMatch.matchingSkills}
                    missing={jobMatch.missingSkills}
                />
            )}

            {(jobMatch.tailoredSummary || jobMatch.coverLetterOpener) && (
                <div className="mt-5 space-y-3">
                    <h4 className="text-xs text-muted">
                        Tailored for this job (built only from your resume; check every claim before using it)
                    </h4>
                    <TailoredBlock title="Professional summary" text={jobMatch.tailoredSummary} />
                    <TailoredBlock title="Cover letter opener" text={jobMatch.coverLetterOpener} />
                </div>
            )}
        </section>
    );
}
