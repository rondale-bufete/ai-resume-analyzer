import ScoreGauge from "./ScoreGauge";

export default function AnalysisResults({ result }) {
    const {
        overallScore,
        summary,
        strengths,
        weaknesses,
        atsIssues,
        sections,
        rewriteSuggestions,
        jobMatch,
    } = result;

    return (
        <div className="space-y-6">
            <div className="glow-border bg-[#181C1A] border border-white/[0.06] rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
                <ScoreGauge score={overallScore} label="Overall Score" />
                {jobMatch && <ScoreGauge score={jobMatch.matchScore} label="Job Match" />}
                <p className="text-sm text-[#D2D2D2] leading-relaxed sm:flex-1">{summary}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#181C1A] border border-white/[0.06] rounded-xl p-5">
                    <h3 className="text-sm font-medium text-green-400 mb-3">Strengths</h3>
                    <ul className="space-y-2">
                        {strengths.map((s, i) => (
                            <li key={i} className="text-sm text-[#D2D2D2] flex gap-2">
                                <span className="text-green-400 shrink-0">+</span>
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-[#181C1A] border border-white/[0.06] rounded-xl p-5">
                    <h3 className="text-sm font-medium text-amber-400 mb-3">Weaknesses</h3>
                    <ul className="space-y-2">
                        {weaknesses.map((w, i) => (
                            <li key={i} className="text-sm text-[#D2D2D2] flex gap-2">
                                <span className="text-amber-400 shrink-0">−</span>
                                {w}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {atsIssues.length > 0 && (
                <div className="bg-red-500/[0.05] border border-red-500/20 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-red-400 mb-3">⚠ ATS Formatting Risks</h3>
                    <ul className="space-y-2">
                        {atsIssues.map((issue, i) => (
                            <li key={i} className="text-sm text-[#D2D2D2]">
                                • {issue}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {jobMatch && (
                <div className="bg-[#181C1A] border border-white/[0.06] rounded-xl p-5">
                    <h3 className="text-sm font-medium text-[#14B8A6] mb-4">Job Match Detail</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-xs text-[#6E6A64] mb-2">Matching Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                                {jobMatch.matchingSkills.map((skill) => (
                                    <span key={skill} className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-300">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-[#6E6A64] mb-2">Missing Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                                {jobMatch.missingSkills.map((skill) => (
                                    <span key={skill} className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-300">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-[#A29E97] leading-relaxed">{jobMatch.notes}</p>
                </div>
            )}

            <div className="bg-[#181C1A] border border-white/[0.06] rounded-xl p-5">
                <h3 className="text-sm font-medium text-[#EDECE9] mb-4">Section-by-Section Feedback</h3>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    {sections.map((section, i) => (
                        <div key={i} className="pb-4 border-b border-white/[0.05] md:border-0 md:pb-0">
                            <p className="text-sm font-medium text-[#14B8A6] mb-1">{section.name}</p>
                            <p className="text-sm text-[#A29E97] leading-relaxed">{section.feedback}</p>
                        </div>
                    ))}
                </div>
            </div>

            {rewriteSuggestions.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-[#EDECE9] mb-4">Suggested Rewrites</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {rewriteSuggestions.map((r, i) => (
                            <div key={i} className="bg-[#181C1A] border border-white/[0.06] rounded-xl p-5">
                                <div className="mb-3">
                                    <p className="text-xs text-red-400 mb-1">Original</p>
                                    <p className="text-sm text-[#A29E97] italic">&ldquo;{r.original}&rdquo;</p>
                                </div>
                                <div className="mb-3">
                                    <p className="text-xs text-green-400 mb-1">Suggested</p>
                                    <p className="text-sm text-[#EDECE9]">&ldquo;{r.suggested}&rdquo;</p>
                                </div>
                                <p className="text-xs text-[#6E6A64] leading-relaxed">{r.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}