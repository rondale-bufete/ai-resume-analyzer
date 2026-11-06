"use client";

import { useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { ACCEPT_ATTRIBUTE, MAX_FILE_BYTES, MAX_JOB_CHARS, MAX_RESUME_CHARS, formatBytes } from "@/lib/limits";
import PrivacyNote from "./PrivacyNote";
import { buttonPrimary, linkButton } from "./ui";

export const SAMPLE_RESUME = `John Doe
john.doe@email.com | (555) 012-3456 | linkedin.com/in/johndoe

SUMMARY
Frontend developer with 2 years of experience building web applications using React and Next.js. Passionate about clean UI and performance.

EXPERIENCE
Junior Frontend Developer — Company X Inc.
June 2023 - Present
- Worked on the company website using React
- Fixed bugs and helped with new features
- Collaborated with the design team

Freelance Web Developer
January 2022 - May 2023
- Built websites for small businesses
- Used HTML, CSS, and JavaScript

EDUCATION
BS in Computer Science
State University, 2022

SKILLS
JavaScript, React, HTML, CSS, Git, Figma`;

const fieldClass =
    "w-full rounded-lg border bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-muted resize-y focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60";

function CharCount({ value, max, id }) {
    const over = value.length > max;
    return (
        <span id={id} className={`text-xs tabular-nums ${over ? "text-poor" : "text-muted"}`}>
            {value.length.toLocaleString()} / {max.toLocaleString()}
        </span>
    );
}

function FieldError({ id, message }) {
    if (!message) return null;
    return (
        <p id={id} className="mt-1.5 text-xs text-poor">
            {message}
        </p>
    );
}

function ModeToggle({ mode, onChange }) {
    const options = [
        { value: "paste", label: "Paste text", icon: FileText },
        { value: "upload", label: "Upload file", icon: Upload },
    ];
    return (
        <div role="group" aria-label="How to add your resume" className="flex gap-2">
            {options.map(({ value, label, icon: Icon }) => {
                const active = mode === value;
                return (
                    <button
                        key={value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onChange(value)}
                        className={`flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${active ? "bg-accent text-on-accent" : "bg-white/[0.05] text-ink-soft hover:text-ink"
                            }`}
                    >
                        <Icon aria-hidden="true" className="h-4 w-4" />
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

function FileDropZone({ file, onSelect, onRemove, error }) {
    const [isDragging, setIsDragging] = useState(false);

    function handleDrop(event) {
        event.preventDefault();
        setIsDragging(false);
        const dropped = event.dataTransfer.files?.[0];
        if (dropped) onSelect(dropped);
    }

    if (file) {
        return (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-accent/40 bg-accent/[0.06] px-4 py-3">
                <div className="flex min-w-0 items-center gap-2.5">
                    <FileText aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{file.name}</p>
                        <p className="text-xs text-muted">{formatBytes(file.size)}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label={`Remove ${file.name}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-ink-soft hover:bg-white/[0.06] hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
                >
                    <X aria-hidden="true" className="h-4 w-4" />
                </button>
            </div>
        );
    }

    return (
        <label
            htmlFor="resume-file"
            onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={`block cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/40 ${isDragging ? "border-accent bg-accent/[0.06]" : error ? "border-poor/60" : "border-white/10 hover:border-accent/40"
                }`}
        >
            <input
                id="resume-file"
                type="file"
                accept={ACCEPT_ATTRIBUTE}
                className="sr-only"
                aria-describedby={error ? "resume-file-error" : "resume-file-hint"}
                aria-invalid={Boolean(error)}
                onChange={(event) => {
                    const selected = event.target.files?.[0];
                    if (selected) onSelect(selected);
                    event.target.value = ""; // allow re-selecting the same file after removing it
                }}
            />
            <Upload aria-hidden="true" className="mx-auto mb-2 h-6 w-6 text-accent" />
            <p className="text-sm text-ink">{isDragging ? "Drop your file here" : "Choose a file, or drag one here"}</p>
            <p id="resume-file-hint" className="mt-1 text-xs text-muted">
                PDF or Word (.docx), up to {formatBytes(MAX_FILE_BYTES)}
            </p>
        </label>
    );
}

export default function ResumeInput({
    mode,
    onModeChange,
    resumeText,
    onResumeTextChange,
    file,
    onFileSelect,
    onFileRemove,
    jobDescription,
    onJobDescriptionChange,
    onUseSample,
    errors,
    loading,
    onSubmit,
    resumeTextRef,
}) {
    return (
        <form
            noValidate
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
            className="space-y-4"
        >
            <ModeToggle mode={mode} onChange={onModeChange} />

            {mode === "paste" ? (
                <div>
                    <div className="mb-1.5 flex items-baseline justify-between">
                        <label htmlFor="resume-text" className="text-sm text-ink-soft">
                            Resume text
                        </label>
                        <CharCount id="resume-text-count" value={resumeText} max={MAX_RESUME_CHARS} />
                    </div>
                    <textarea
                        id="resume-text"
                        ref={resumeTextRef}
                        rows={10}
                        value={resumeText}
                        onChange={(event) => onResumeTextChange(event.target.value)}
                        placeholder="Paste your resume here…"
                        aria-invalid={Boolean(errors.resume)}
                        aria-describedby={`resume-text-count${errors.resume ? " resume-text-error" : ""}`}
                        className={`${fieldClass} font-mono text-[13px] leading-relaxed ${errors.resume ? "border-poor/60" : "border-white/10"}`}
                    />
                    <FieldError id="resume-text-error" message={errors.resume} />
                </div>
            ) : (
                <div>
                    <p className="mb-1.5 text-sm text-ink-soft">Resume file</p>
                    <FileDropZone file={file} onSelect={onFileSelect} onRemove={onFileRemove} error={errors.file} />
                    <FieldError id="resume-file-error" message={errors.file} />
                </div>
            )}

            <button type="button" onClick={onUseSample} className={`${linkButton} min-h-8 text-xs`}>
                Try with a sample resume →
            </button>

            <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                    <label htmlFor="job-description" className="text-sm text-ink-soft">
                        Job description <span className="text-muted">(optional)</span>
                    </label>
                    <CharCount id="job-description-count" value={jobDescription} max={MAX_JOB_CHARS} />
                </div>
                <textarea
                    id="job-description"
                    rows={5}
                    value={jobDescription}
                    onChange={(event) => onJobDescriptionChange(event.target.value)}
                    placeholder="Paste a job listing to get a match score, keyword map and tailored wording…"
                    aria-invalid={Boolean(errors.jobDescription)}
                    aria-describedby={`job-description-count${errors.jobDescription ? " job-description-error" : ""}`}
                    className={`${fieldClass} ${errors.jobDescription ? "border-poor/60" : "border-white/10"}`}
                />
                <FieldError id="job-description-error" message={errors.jobDescription} />
            </div>

            <button type="submit" disabled={loading} className={`${buttonPrimary} min-h-11 w-full`}>
                {loading ? "Analyzing…" : "Analyze resume"}
            </button>

            <PrivacyNote className="text-center" />
        </form>
    );
}
