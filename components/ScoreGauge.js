const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function scoreTone(score) {
    if (score >= 80) return { label: "Strong", color: "var(--color-good)" };
    if (score >= 60) return { label: "Fair", color: "var(--color-fair)" };
    return { label: "Needs work", color: "var(--color-poor)" };
}

export function ScoreDelta({ score, previousScore }) {
    if (previousScore == null) return null;
    const delta = score - previousScore;
    if (delta === 0) return <span className="text-xs text-muted">No change since last run</span>;

    const improved = delta > 0;
    return (
        <span className={`text-xs font-medium ${improved ? "text-good" : "text-poor"}`}>
            {improved ? "▲" : "▼"} {improved ? "+" : "−"}
            {Math.abs(delta)} since last run
            <span className="sr-only"> (was {previousScore})</span>
        </span>
    );
}

export default function ScoreGauge({ score, label, previousScore }) {
    const tone = scoreTone(score);
    const dashOffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

    return (
        <figure className="flex shrink-0 flex-col items-center">
            <div className="relative h-36 w-36">
                <svg viewBox="0 0 120 120" aria-hidden="true" className="h-full w-full -rotate-90">
                    <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="var(--color-line)" strokeWidth="8" />
                    <circle
                        className="gauge-arc"
                        cx="60"
                        cy="60"
                        r={RADIUS}
                        fill="none"
                        stroke={tone.color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={dashOffset}
                        style={{ "--gauge-empty": CIRCUMFERENCE }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-4xl font-semibold tabular-nums" style={{ color: tone.color }}>
                        {score}
                        <span className="sr-only"> out of 100</span>
                    </span>
                </div>
            </div>
            <figcaption className="mt-2 flex flex-col items-center gap-0.5 text-center">
                <span className="text-sm text-ink-soft">{label}</span>
                <span className="text-xs font-medium" style={{ color: tone.color }}>
                    {tone.label}
                </span>
                <ScoreDelta score={score} previousScore={previousScore} />
            </figcaption>
        </figure>
    );
}
