import Link from "next/link";

const STEPS = [
  {
    number: "01",
    title: "Submit your resume",
    description: "Paste your resume text or upload a PDF — your choice.",
  },
  {
    number: "02",
    title: "Add a job description",
    description: "Optional. Paste a listing to get a tailored match score and skill gap analysis.",
  },
  {
    number: "03",
    title: "Get structured feedback",
    description: "Scores, section-by-section notes, and specific rewrite suggestions — not generic tips.",
  },
];

const FEATURES = [
  {
    title: "ATS risk detection",
    description: "Flags formatting and structure issues that could cause parsing failures in applicant tracking systems.",
  },
  {
    title: "Job match scoring",
    description: "Compares your resume against a specific job description and highlights matching and missing skills.",
  },
  {
    title: "Rewrite suggestions",
    description: "Specific before-and-after rewrites for weak bullet points, with the reasoning behind each change.",
  },
  {
    title: "Section-by-section notes",
    description: "Feedback broken down by resume section, rather than one generic overall comment.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-white/[0.06] px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#14B8A6] flex items-center justify-center">
              <span className="text-[#0F1210] text-sm font-bold">R</span>
            </div>
            <span className="font-[family-name:var(--font-display)] text-lg tracking-tight">
              Resume Analyzer
            </span>
          </div>
          <Link
            href="/analyze"
            className="text-sm font-medium px-4 py-2 rounded-md bg-[#14B8A6] text-[#0F1210] hover:bg-[#2dd4bf] transition-colors"
          >
            Try it
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <p className="font-[family-name:var(--font-mono,monospace)] text-sm text-[#14B8A6] mb-4">
          AI-powered resume review
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl font-medium tracking-tight leading-[1.1] mb-6 max-w-3xl mx-auto">
          Know exactly what to fix, before a recruiter does
        </h1>
        <p className="text-[#8A8F8B] text-lg leading-relaxed max-w-xl mx-auto mb-10">
          Upload your resume, paste a job description, and get a structured breakdown of what&rsquo;s
          working, what isn&rsquo;t, and how to say it better.
        </p>
        <Link
          href="/analyze"
          className="inline-block px-7 py-3 rounded-lg bg-[#14B8A6] text-[#0F1210] font-medium hover:bg-[#2dd4bf] transition-colors"
        >
          Analyze your resume
        </Link>
      </section>

      {/* How it works */}
      <section className="border-t border-white/[0.06] px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="font-[family-name:var(--font-mono,monospace)] text-sm text-[#14B8A6] mb-3">
            How it works
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-medium tracking-tight mb-12 max-w-lg">
            Three steps to a sharper resume
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.number}>
                <p className="font-[family-name:var(--font-display)] text-3xl text-white/10 mb-3">
                  {step.number}
                </p>
                <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-sm text-[#8A8F8B] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/[0.06] px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="font-[family-name:var(--font-mono,monospace)] text-sm text-[#14B8A6] mb-3">
            What you get
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-medium tracking-tight mb-12 max-w-lg">
            Specific feedback, not generic advice
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-[#181C1A] border border-white/[0.06] rounded-xl p-6 hover:border-[#14B8A6]/30 transition-colors"
              >
                <h3 className="text-base font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-[#8A8F8B] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-white/[0.06] px-6 py-20 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-medium tracking-tight mb-6">
          Ready to see where your resume stands?
        </h2>
        <Link
          href="/analyze"
          className="inline-block px-7 py-3 rounded-lg bg-[#14B8A6] text-[#0F1210] font-medium hover:bg-[#2dd4bf] transition-colors"
        >
          Analyze your resume
        </Link>
      </section>

      <footer className="border-t border-white/[0.06] px-6 py-8 text-center">
        <p className="text-xs text-[#6E6A64] max-w-md mx-auto leading-relaxed">
          Built with Next.js and Google Gemini. Feedback is AI-generated and may be inaccurate — treat
          it as a starting point, not a final verdict. Resumes are analyzed on-demand and are not stored.
        </p>
      </footer>
    </main>
  );
}