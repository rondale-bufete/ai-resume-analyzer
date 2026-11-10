"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { FileSearch, RefreshCw } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import ResumeInput, { SAMPLE_RESUME } from "@/components/ResumeInput";
import AnalysisResults from "@/components/AnalysisResults";
import LoadingStages from "@/components/LoadingStages";
import HistoryPanel from "@/components/HistoryPanel";
import { buttonPrimary, card } from "@/components/ui";
import {
    clearHistory,
    findPreviousRun,
    getHistorySnapshot,
    getServerHistorySnapshot,
    resumeLabel,
    saveToHistory,
    subscribeHistory,
} from "@/lib/history";
import { applyRewrite, canApplyRewrite } from "@/lib/rewrites";
import { checkSelectedFile, validateForm } from "@/lib/validation";

function createId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function friendlyRequestError(err) {
    if (err instanceof TypeError) return "Couldn't reach the server. Check your connection and try again.";
    return err.message || "Analysis failed. Please try again.";
}

export default function AnalyzePage() {
    const [mode, setMode] = useState("paste");
    const [resumeText, setResumeText] = useState("");
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [requestError, setRequestError] = useState(null);
    const [current, setCurrent] = useState(null);
    const [appliedIndexes, setAppliedIndexes] = useState(() => new Set());

    const history = useSyncExternalStore(subscribeHistory, getHistorySnapshot, getServerHistorySnapshot);

    const resultsHeadingRef = useRef(null);
    const resumeTextRef = useRef(null);
    const inputPanelRef = useRef(null);
    const revealPending = useRef(false);

    // After a new result renders, move focus to it; on stacked (mobile) layouts also scroll to it,
    // since the results appear below the form and would otherwise go unnoticed.
    useEffect(() => {
        if (!current || !revealPending.current) return;
        revealPending.current = false;
        const heading = resultsHeadingRef.current;
        if (!heading) return;
        const stacked = window.matchMedia("(max-width: 1023px)").matches;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        heading.focus({ preventScroll: true });
        if (stacked) heading.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }, [current]);

    function clearError(field) {
        setErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }

    function showResult(entry, previousRun) {
        setCurrent({ ...entry, previousRun });
        setAppliedIndexes(new Set());
        revealPending.current = true;
    }

    async function handleSubmit() {
        const formErrors = validateForm({ mode, resumeText, file, jobDescription });
        setErrors(formErrors);
        if (Object.keys(formErrors).length > 0) return;

        const formData = new FormData();
        formData.append("jobDescription", jobDescription);
        if (mode === "upload") formData.append("resumeFile", file);
        else formData.append("resumeText", resumeText);

        const label = resumeLabel({ file: mode === "upload" ? file : null, resumeText });
        const previousRun = findPreviousRun(history, label);

        setLoading(true);
        setRequestError(null);

        try {
            const res = await fetch("/api/analyze", { method: "POST", body: formData });
            const data = await res.json().catch(() => null);

            if (!res.ok || !data?.result) {
                throw new Error(data?.error || "Analysis failed. Please try again.");
            }

            const entry = {
                id: createId(),
                label,
                createdAt: Date.now(),
                result: data.result,
                jobDescription: jobDescription.trim(),
                overallScore: data.result.overallScore,
                matchScore: data.result.jobMatch?.matchScore ?? null,
            };
            saveToHistory(entry);
            showResult(entry, previousRun);
        } catch (err) {
            setRequestError(friendlyRequestError(err));
        } finally {
            setLoading(false);
        }
    }

    function handleSelectHistory(entry) {
        const earlier = history.filter((item) => item.createdAt < entry.createdAt);
        showResult(entry, findPreviousRun(earlier, entry.label));
    }

    function handleFileSelect(selected) {
        const fileError = checkSelectedFile(selected);
        if (fileError) {
            setErrors((prev) => ({ ...prev, file: fileError }));
            return;
        }
        setFile(selected);
        clearError("file");
    }

    function handleUseSample() {
        setMode("paste");
        setFile(null);
        setResumeText(SAMPLE_RESUME);
        setErrors({});
    }

    function handleApplyRewrite(index) {
        const rewrite = current.result.rewriteSuggestions[index];
        setResumeText((text) => applyRewrite(text, rewrite.original, rewrite.suggested));
        setAppliedIndexes((prev) => new Set(prev).add(index));
    }

    function handleEdit() {
        inputPanelRef.current?.scrollIntoView({ block: "start" });
        if (mode === "paste") resumeTextRef.current?.focus({ preventScroll: true });
    }

    const canApply = (original) => mode === "paste" && canApplyRewrite(resumeText, original);
    const appliedCount = appliedIndexes.size;

    return (
        <>
            <SiteHeader
                action={
                    <Link
                        href="/"
                        className="rounded text-sm text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
                    >
                        ← Back home
                    </Link>
                }
            />

            <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[400px_1fr] print:block print:p-0">
                <div ref={inputPanelRef} className="scroll-mt-6 print:hidden lg:sticky lg:top-6 lg:self-start">
                    <h1 className="mb-2 font-display text-2xl font-medium tracking-tight">Get instant feedback</h1>
                    <p className="mb-6 text-sm leading-relaxed text-ink-soft">
                        Upload or paste your resume. Add a job description to get a match score and gap analysis.
                    </p>

                    <div className={`${card} p-5`}>
                        <ResumeInput
                            mode={mode}
                            onModeChange={(next) => {
                                setMode(next);
                                clearError("resume");
                                clearError("file");
                            }}
                            resumeText={resumeText}
                            onResumeTextChange={(value) => {
                                setResumeText(value);
                                clearError("resume");
                            }}
                            file={file}
                            onFileSelect={handleFileSelect}
                            onFileRemove={() => setFile(null)}
                            jobDescription={jobDescription}
                            onJobDescriptionChange={(value) => {
                                setJobDescription(value);
                                clearError("jobDescription");
                            }}
                            onUseSample={handleUseSample}
                            errors={errors}
                            loading={loading}
                            onSubmit={handleSubmit}
                            resumeTextRef={resumeTextRef}
                        />
                    </div>

                    {requestError && (
                        <p
                            role="alert"
                            className="mt-4 rounded-lg border border-poor/25 bg-poor/10 px-4 py-3 text-sm text-poor"
                        >
                            {requestError}
                        </p>
                    )}

                    <HistoryPanel
                        entries={history}
                        activeId={current?.id}
                        onSelect={handleSelectHistory}
                        onClear={clearHistory}
                    />
                </div>

                <div className="min-w-0">
                    {loading ? (
                        <LoadingStages hasJobDescription={Boolean(jobDescription.trim())} />
                    ) : current ? (
                        <>
                            <AnalysisResults
                                key={current.id}
                                result={current.result}
                                meta={current}
                                previousRun={current.previousRun}
                                jobDescription={current.jobDescription}
                                canApply={canApply}
                                appliedIndexes={appliedIndexes}
                                onApplyRewrite={handleApplyRewrite}
                                onEdit={handleEdit}
                                headingRef={resultsHeadingRef}
                            />
                            {appliedCount > 0 && (
                                <div
                                    role="status"
                                    className="sticky bottom-4 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/40 bg-surface-raised px-4 py-3 shadow-lg shadow-black/40 print:hidden"
                                >
                                    <p className="text-sm text-ink">
                                        You applied {appliedCount} rewrite{appliedCount > 1 ? "s" : ""}. Re-analyze to see
                                        your new score.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className={`${buttonPrimary} min-h-10 px-4 text-sm`}
                                    >
                                        <RefreshCw aria-hidden="true" className="h-4 w-4" />
                                        Re-analyze
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-dashed border-white/10">
                            <div className="px-6 text-center">
                                <FileSearch aria-hidden="true" className="mx-auto mb-3 h-10 w-10 text-accent/60" />
                                <p className="text-sm text-ink-soft">
                                    Your analysis will appear here once you submit a resume.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
