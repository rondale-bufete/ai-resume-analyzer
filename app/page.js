"use client";

import { useState } from "react";
import ResumeInput from "@/components/ResumeInput";
import AnalysisResults from "@/components/AnalysisResults";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze(formData) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-white/[0.06] px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#14B8A6] flex items-center justify-center">
            <span className="text-[#0F1210] text-sm font-bold">R</span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-lg tracking-tight">
            Resume Analyzer
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-[380px_1fr] gap-8">
        {/* Left: sticky input panel */}
        <div className="lg:sticky lg:top-10 lg:self-start">
          <p className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight mb-2">
            Get instant feedback
          </p>
          <p className="text-sm text-[#8A8F8B] mb-6 leading-relaxed">
            Upload or paste your resume. Add a job description to get a match score and gap analysis.
          </p>

          <div className="bg-[#181C1A] border border-white/[0.06] rounded-xl p-5">
            <ResumeInput onAnalyze={handleAnalyze} loading={loading} />
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}
        </div>

        {/* Right: results */}
        <div>
          {!result && !loading && (
            <div className="h-full min-h-[400px] flex items-center justify-center border border-dashed border-white/10 rounded-xl">
              <div className="text-center px-6">
                <p className="text-4xl mb-3">📄</p>
                <p className="text-sm text-[#8A8F8B]">
                  Your analysis will appear here once you submit a resume.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] flex items-center justify-center border border-white/[0.06] rounded-xl bg-[#181C1A]">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#14B8A6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-[#8A8F8B]">Analyzing your resume...</p>
              </div>
            </div>
          )}

          {result && !loading && <AnalysisResults result={result} />}
        </div>
      </div>
    </main>
  );
}