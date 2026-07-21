const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getColor(score) {
    if (score >= 80) return "#34D399";
    if (score >= 60) return "#FBBF24";
    return "#F87171";
}

export default function ScoreGauge({ score, label }) {
    const color = getColor(score);
    const dashOffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

    return (
        <div className="flex flex-col items-center shrink-0">
            <div className="relative w-36 h-36">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                    <circle
                        cx="60"
                        cy="60"
                        r={RADIUS}
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={dashOffset}
                        style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-semibold font-[family-name:var(--font-display)]" style={{ color }}>
                        {score}
                    </span>
                </div>
            </div>
            <p className="text-sm text-[#8A8F8B] mt-2">{label}</p>
        </div>
    );
}