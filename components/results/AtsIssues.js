import { TriangleAlert } from "lucide-react";

const SEVERITY_STYLE = {
    high: { label: "High", className: "bg-poor/15 text-poor" },
    medium: { label: "Medium", className: "bg-fair/15 text-fair" },
    low: { label: "Low", className: "bg-white/[0.06] text-ink-soft" },
};

export default function AtsIssues({ issues }) {
    if (issues.length === 0) return null;

    return (
        <section
            aria-labelledby="ats-heading"
            className="print-avoid-break rounded-xl border border-poor/25 bg-poor/[0.05] p-5"
        >
            <h3 id="ats-heading" className="mb-3 flex items-center gap-2 text-sm font-medium text-poor">
                <TriangleAlert aria-hidden="true" className="h-4 w-4" />
                ATS formatting risks
            </h3>
            <ul className="space-y-2.5">
                {issues.map((item, i) => {
                    const severity = SEVERITY_STYLE[item.severity];
                    return (
                        <li key={i} className="flex items-start gap-3 text-sm text-ink-soft">
                            <span
                                className={`mt-0.5 w-16 shrink-0 rounded px-1.5 py-0.5 text-center text-[11px] font-medium uppercase tracking-wide ${severity.className}`}
                            >
                                {severity.label}
                                <span className="sr-only"> severity:</span>
                            </span>
                            <span>{item.issue}</span>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
