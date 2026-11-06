"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const STAGE_INTERVAL_MS = 3500;

// The API returns in one response, so these stages are paced estimates that tell the user
// what is being checked rather than literal progress.
function buildStages(hasJobDescription) {
    return [
        "Reading your resume",
        "Checking ATS formatting",
        "Scoring impact and clarity",
        ...(hasJobDescription ? ["Comparing with the job description"] : []),
        "Writing rewrite suggestions",
    ];
}

export default function LoadingStages({ hasJobDescription }) {
    const stages = buildStages(hasJobDescription);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((index) => Math.min(index + 1, stages.length - 1));
        }, STAGE_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [stages.length]);

    return (
        <div
            role="status"
            aria-live="polite"
            className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-line bg-surface p-6"
        >
            <div className="w-full max-w-xs">
                <div
                    aria-hidden="true"
                    className="mx-auto mb-6 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent motion-reduce:animate-none"
                />
                <ol className="space-y-2.5">
                    {stages.map((stage, i) => {
                        const done = i < current;
                        const active = i === current;
                        return (
                            <li
                                key={stage}
                                className={`flex items-center gap-2.5 text-sm ${active ? "text-ink" : done ? "text-ink-soft" : "text-muted"}`}
                                aria-current={active ? "step" : undefined}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${done ? "border-accent bg-accent text-on-accent" : active ? "border-accent" : "border-line"
                                        }`}
                                >
                                    {done && <Check className="h-3 w-3" />}
                                </span>
                                {stage}
                                {active && "…"}
                            </li>
                        );
                    })}
                </ol>
                <p className="mt-6 text-center text-xs text-muted">This usually takes 10–30 seconds.</p>
            </div>
        </div>
    );
}
