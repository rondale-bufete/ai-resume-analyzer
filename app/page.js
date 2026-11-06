import Link from "next/link";
import { BarChart3, FileText, Gauge, ScanSearch, Sparkles, Target } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import PrivacyNote from "@/components/PrivacyNote";
import { buttonPrimary } from "@/components/ui";

const STEPS = [
  {
    number: "01",
    title: "Submit your resume",
    description: "Paste the text, or upload a PDF or Word file.",
  },
  {
    number: "02",
    title: "Add a job description",
    description: "Optional. Paste a listing to get a match score, skill gaps and tailored wording.",
  },
  {
    number: "03",
    title: "Fix it and re-check",
    description: "Apply suggested rewrites in one click, re-analyze and watch your score change.",
  },
];

const FEATURES = [
  {
    icon: Gauge,
    title: "Score breakdown",
    description: "See why you got your score: impact, clarity, ATS formatting and keywords, each rated.",
  },
  {
    icon: ScanSearch,
    title: "ATS risk detection",
    description: "Flags formatting and structure issues that can break applicant tracking systems, ranked by severity.",
  },
  {
    icon: Target,
    title: "Job match and keyword map",
    description: "Highlights which keywords from the job post your resume covers and which are missing.",
  },
  {
    icon: Sparkles,
    title: "One-click rewrites",
    description: "Before-and-after rewrites for weak lines, with the reasoning. Copy them or apply them straight to your text.",
  },
  {
    icon: FileText,
    title: "Tailored summary and cover letter opener",
    description: "Wording aimed at the job you pasted, built only from what your resume already says.",
  },
  {
    icon: BarChart3,
    title: "Progress you can see",
    description: "Recent results stay in your browser, so you can compare runs and print a clean report.",
  },
];

export default function LandingPage() {
  return (
    <>
      <SiteHeader
        action={
          <Link href="/analyze" className={`${buttonPrimary} px-4 py-2 text-sm`}>
            Try it
          </Link>
        }
      />

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-24 pt-20 text-center sm:px-6">
          <p className="mb-4 font-mono text-sm text-accent">AI-powered resume review</p>
          <h1 className="mx-auto mb-6 max-w-3xl font-display text-[clamp(2.25rem,6vw,3.75rem)] font-medium leading-[1.1] tracking-tight">
            Know exactly what to fix, before a recruiter does
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-ink-soft">
            Upload your resume, paste a job description, and get a structured breakdown of what&rsquo;s working, what
            isn&rsquo;t, and how to say it better.
          </p>
          <Link href="/analyze" className={`${buttonPrimary} px-7 py-3`}>
            Analyze your resume
          </Link>
        </section>

        <section aria-labelledby="how-heading" className="border-t border-line px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 font-mono text-sm text-accent">How it works</p>
            <h2 id="how-heading" className="mb-12 max-w-lg font-display text-2xl font-medium tracking-tight md:text-3xl">
              Three steps to a sharper resume
            </h2>
            <ol className="grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <li key={step.number}>
                  <p aria-hidden="true" className="mb-3 font-display text-3xl text-accent/30">
                    {step.number}
                  </p>
                  <h3 className="mb-2 text-lg font-medium">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="features-heading" className="border-t border-line px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 font-mono text-sm text-accent">What you get</p>
            <h2 id="features-heading" className="mb-12 max-w-lg font-display text-2xl font-medium tracking-tight md:text-3xl">
              Specific feedback, not generic advice
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <li
                  key={title}
                  className="rounded-xl border border-line bg-surface p-6 transition-colors hover:border-accent/30"
                >
                  <Icon aria-hidden="true" className="mb-4 h-5 w-5 text-accent" />
                  <h3 className="mb-2 text-base font-medium">{title}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft">{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-line px-4 py-20 text-center sm:px-6">
          <h2 className="mb-6 font-display text-2xl font-medium tracking-tight md:text-3xl">
            Ready to see where your resume stands?
          </h2>
          <Link href="/analyze" className={`${buttonPrimary} px-7 py-3`}>
            Analyze your resume
          </Link>
        </section>
      </main>

      <footer className="border-t border-line px-4 py-8 text-center sm:px-6">
        <p className="mb-2 text-xs text-muted">Built with Next.js and Google Gemini.</p>
        <PrivacyNote className="mx-auto max-w-lg" />
      </footer>
    </>
  );
}
