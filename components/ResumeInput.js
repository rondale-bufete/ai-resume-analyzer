"use client";

import { useState } from "react";

export default function ResumeInput({ onAnalyze, loading }) {
    const [inputMode, setInputMode] = useState("paste");
    const [resumeText, setResumeText] = useState("");
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    function validateAndSetFile(selected) {
        if (selected && selected.type === "application/pdf") {
            setFile(selected);
        } else if (selected) {
            alert("Please upload a PDF file.");
        }
    }

    function handleFileChange(e) {
        validateAndSetFile(e.target.files?.[0]);
    }

    function handleDragOver(e) {
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(e) {
        e.preventDefault();
        setIsDragging(false);
    }

    function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        const dropped = e.dataTransfer.files?.[0];
        validateAndSetFile(dropped);
    }

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("jobDescription", jobDescription);

        if (inputMode === "upload" && file) {
            formData.append("resumeFile", file);
        } else if (inputMode === "paste" && resumeText.trim()) {
            formData.append("resumeText", resumeText);
        } else {
            alert("Please provide a resume, either pasted or uploaded.");
            return;
        }

        onAnalyze(formData);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setInputMode("paste")}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${inputMode === "paste" ? "bg-[#14B8A6] text-[#0F1210]" : "bg-white/[0.05] text-[#8A8F8B] hover:text-[#EDECE9]"
                        }`}
                >
                    Paste Text
                </button>
                <button
                    type="button"
                    onClick={() => setInputMode("upload")}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${inputMode === "upload" ? "bg-[#14B8A6] text-[#0F1210]" : "bg-white/[0.05] text-[#8A8F8B] hover:text-[#EDECE9]"
                        }`}
                >
                    Upload PDF
                </button>
            </div>

            {inputMode === "paste" ? (
                <textarea
                    rows={9}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here..."
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0F1210] border border-white/10 text-[#EDECE9] focus:outline-none focus:border-[#14B8A6] font-mono text-xs resize-y placeholder:text-[#6E6A64]"
                />
            ) : (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging
                        ? "border-[#14B8A6] bg-[#14B8A6]/[0.06]"
                        : "border-white/10"
                        }`}
                >
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        id="resume-file"
                        className="hidden"
                    />
                    <label htmlFor="resume-file" className="cursor-pointer block">
                        {file ? (
                            <p className="text-sm text-[#EDECE9] font-medium break-all">📄 {file.name}</p>
                        ) : (
                            <>
                                <p className="text-2xl mb-2">{isDragging ? "📥" : "📎"}</p>
                                <p className="text-sm text-[#8A8F8B]">
                                    {isDragging ? "Drop your PDF here" : "Click to choose a PDF, or drag one here"}
                                </p>
                            </>
                        )}
                    </label>
                </div>
            )}

            <div>
                <label className="block text-xs text-[#8A8F8B] mb-1.5">
                    Job description <span className="text-[#6E6A64]">(optional but recommended)</span>
                </label>
                <textarea
                    rows={4}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job description for match scoring..."
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0F1210] border border-white/10 text-[#EDECE9] focus:outline-none focus:border-[#14B8A6] text-xs resize-y placeholder:text-[#6E6A64]"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-[#14B8A6] text-[#0F1210] font-medium hover:bg-[#2dd4bf] transition-colors disabled:opacity-60"
            >
                {loading ? "Analyzing..." : "Analyze Resume"}
            </button>

            <p className="text-xs text-[#6E6A64] leading-relaxed text-center">
                AI-generated feedback may be inaccurate. Your resume isn&rsquo;t stored — it&rsquo;s sent to
                Google Gemini for analysis only.
            </p>
        </form>
    );
}