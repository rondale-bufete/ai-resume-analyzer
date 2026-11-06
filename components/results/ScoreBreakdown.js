import { scoreTone } from "../ScoreGauge";
import { card, sectionTitle } from "../ui";

const CRITERIA = [
    { key: "impact", label: "Impact", hint: "Concrete, quantified achievements" },
    { key: "clarity", label: "Clarity", hint: "Concise, readable, well organized" },
    { key: "atsFormatting", label: "ATS formatting", hint: "Parses cleanly in tracking systems" },
    { key: "keywords", label: "Keywords", hint: "Relevant role and industry terms" },
];

export default function ScoreBreakdown({ breakdown }) {
    return (
        <section aria-labelledby="breakdown-heading" className={`${card} print-avoid-break p-5`}>
            <h3 id="breakdown-heading" className={`${sectionTitle} mb-4`}>
                Score breakdown
            </h3>
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {CRITERIA.map(({ key, label, hint }) => {
                    const value = breakdown[key];
                    const tone = scoreTone(value);
                    return (
                        <div key={key}>
                            <div className="mb-1.5 flex items-baseline justify-between gap-3">
                                <dt className="text-sm text-ink">
                                    {label}
                                    <span className="block text-xs text-muted">{hint}</span>
                                </dt>
                                <dd className="font-display text-lg tabular-nums" style={{ color: tone.color }}>
                                    {value}
                                    <span className="sr-only"> out of 100, {tone.label}</span>
                                </dd>
                            </div>
                            <div aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-white/[0.08] print:bg-line">
                                <div
                                    className="bar-fill h-full rounded-full"
                                    style={{ width: `${value}%`, background: tone.color }}
                                />
                            </div>
                        </div>
                    );
                })}
            </dl>
        </section>
    );
}
