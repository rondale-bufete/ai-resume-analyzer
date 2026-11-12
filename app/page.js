"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  FileText,
  Gauge,
  LockKeyhole,
  ScanSearch,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import PrivacyNote from "@/components/PrivacyNote";
import { buttonPrimary } from "@/components/ui";

const STEPS = [
  {
    number: "01",
    title: "Share your resume",
    description: "Paste your text or upload a PDF or Word file. Your original stays yours.",
  },
  {
    number: "02",
    title: "Add the opportunity",
    description: "Bring a job description into the picture for a focused match score and skill-gap analysis.",
  },
  {
    number: "03",
    title: "Make your next move",
    description: "Apply thoughtful rewrites, re-check your score and see the difference.",
  },
];

const FEATURES = [
  {
    icon: Gauge,
    title: "A score with context",
    description: "Understand impact, clarity, ATS formatting and keywords, each with a useful rating.",
  },
  {
    icon: ScanSearch,
    title: "ATS risk detection",
    description: "Find the formatting and structure issues that can get between you and a recruiter.",
  },
  {
    icon: Target,
    title: "A clearer job match",
    description: "See which skills from the job post are already there, and which deserve attention.",
  },
  {
    icon: Sparkles,
    title: "Rewrites that sound like you",
    description: "Get before-and-after suggestions grounded in the experience you already have.",
  },
  {
    icon: FileText,
    title: "Tailored application copy",
    description: "Build a job-focused summary and cover letter opener from your own resume.",
  },
  {
    icon: BarChart3,
    title: "Progress you can see",
    description: "Compare recent runs in your browser and print a clean report when you're ready.",
  },
];

function ResumePreview() {
  return (
    <div className="landing-preview-wrap" role="img" aria-label="Illustration of a resume analysis dashboard">
      <div className="landing-orbit landing-orbit-one" aria-hidden="true" />
      <div className="landing-orbit landing-orbit-two" aria-hidden="true" />
      <div className="landing-float-note landing-float-note-top">
        <span className="landing-note-icon"><Sparkles aria-hidden="true" /></span>
        <span><strong>Clear, useful feedback</strong><small>Built around your next step</small></span>
      </div>
      <div className="landing-dashboard">
        <div className="landing-dashboard-top">
          <div className="landing-window-dots" aria-hidden="true"><i /><i /><i /></div>
          <span className="landing-dashboard-label">YOUR RESUME SNAPSHOT</span>
          <span className="landing-live"><i /> READY</span>
        </div>
        <div className="landing-score-panel">
          <div className="landing-score-copy">
            <span className="landing-overline">OVERALL SCORE</span>
            <strong>Looking good.</strong>
            <span className="landing-score-description">A few thoughtful edits could make this even stronger.</span>
            <span className="landing-score-change"><TrendingUp aria-hidden="true" /> +12 pts this week</span>
          </div>
          <div className="landing-score-ring" aria-label="Resume score: 82 out of 100">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle className="landing-ring-track" cx="60" cy="60" r="51" />
              <circle className="landing-ring-value" cx="60" cy="60" r="51" />
            </svg>
            <span><strong>82</strong><small>/ 100</small></span>
          </div>
        </div>
        <div className="landing-dashboard-divider" />
        <div className="landing-breakdown-heading"><span>YOUR BREAKDOWN</span><span>Details <ArrowUpRight aria-hidden="true" /></span></div>
        <div className="landing-metric">
          <span className="landing-metric-icon"><Sparkles aria-hidden="true" /></span>
          <span className="landing-metric-name">Impact</span>
          <span className="landing-metric-track"><i style={{ "--bar-width": "88%" }} /></span>
          <strong>88</strong>
        </div>
        <div className="landing-metric">
          <span className="landing-metric-icon"><Target aria-hidden="true" /></span>
          <span className="landing-metric-name">Clarity</span>
          <span className="landing-metric-track"><i style={{ "--bar-width": "76%" }} /></span>
          <strong>76</strong>
        </div>
        <div className="landing-metric">
          <span className="landing-metric-icon"><ScanSearch aria-hidden="true" /></span>
          <span className="landing-metric-name">ATS-ready</span>
          <span className="landing-metric-track"><i style={{ "--bar-width": "92%" }} /></span>
          <strong>92</strong>
        </div>
        <div className="landing-insight">
          <span className="landing-insight-check"><Check aria-hidden="true" /></span>
          <span><strong>One quick win</strong><small>Add a measurable result to your latest role.</small></span>
          <ArrowRight aria-hidden="true" />
        </div>
      </div>
      <div className="landing-float-note landing-float-note-bottom">
        <span className="landing-secure-icon"><LockKeyhole aria-hidden="true" /></span>
        <span><strong>Your resume stays private</strong><small>History saved on this device</small></span>
      </div>
      <div className="landing-spark landing-spark-one" aria-hidden="true">✳</div>
      <div className="landing-spark landing-spark-two" aria-hidden="true">✳</div>
    </div>
  );
}

export default function LandingPage() {
  const mainRef = useRef(null);

  useEffect(() => {
    const main = mainRef.current;
    if (!main || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = main.querySelectorAll(".landing-reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    main.classList.add("landing-reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      <SiteHeader
        action={
          <Link href="/analyze" className={`${buttonPrimary} landing-header-cta px-4 py-2 text-sm`}>
            Try it <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        }
      />

      <main ref={mainRef}>
        <section className="landing-hero">
          <div className="landing-hero-grid" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:grid-cols-[0.94fr_1.06fr] lg:gap-8 lg:pb-28 lg:pt-24">
            <div className="landing-hero-copy">
              <p className="landing-eyebrow landing-hero-enter">
                <span className="landing-eyebrow-mark"><Sparkles aria-hidden="true" /></span>
                YOUR NEXT ROLE STARTS HERE
              </p>
              <h1 className="landing-title landing-hero-enter">
                Know exactly what to fix, <span>before a recruiter does.</span>
              </h1>
              <p className="landing-lede landing-hero-enter">
                Make your experience impossible to overlook. Get clear, practical feedback on your resume and the role
                you want next.
              </p>
              <div className="landing-actions landing-hero-enter">
                <Link href="/analyze" className={`${buttonPrimary} landing-main-cta px-6 py-3.5`}>
                  Analyze your resume <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <a href="#how-heading" className="landing-secondary-link">
                  See how it works <ArrowDown aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
              <div className="landing-trust landing-hero-enter">
                <span><LockKeyhole aria-hidden="true" /> Private by design</span>
                <i aria-hidden="true" />
                <span>No account needed</span>
              </div>
            </div>
            <div className="landing-hero-art landing-hero-enter">
              <ResumePreview />
            </div>
          </div>
          <div className="landing-hero-bottom" aria-hidden="true"><span />MAKE YOUR EXPERIENCE COUNT<span /></div>
        </section>

        <section aria-labelledby="how-heading" className="landing-section landing-steps-section">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
            <div className="landing-section-heading landing-reveal">
              <p className="landing-section-kicker">A SIMPLE, SMARTER PROCESS</p>
              <h2 id="how-heading">Three steps to a sharper resume.</h2>
              <p>Less guessing. More confidence in what you send.</p>
            </div>
            <ol className="landing-steps">
              {STEPS.map((step, index) => (
                <li key={step.number} className="landing-step landing-reveal" style={{ "--reveal-delay": `${index * 100}ms` }}>
                  <div className="landing-step-top"><span>{step.number}</span><i /></div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="features-heading" className="landing-section landing-features-section">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
            <div className="landing-features-intro landing-reveal">
              <div>
                <p className="landing-section-kicker">MORE THAN A SCORE</p>
                <h2 id="features-heading">Specific feedback.<br /><span>Real next steps.</span></h2>
              </div>
              <p>Get a practical plan to make your experience clearer, more relevant and ready to be seen.</p>
            </div>
            <ul className="landing-feature-grid">
              {FEATURES.map(({ icon: Icon, title, description }, index) => (
                <li
                  key={title}
                  className="landing-feature-card landing-reveal"
                  style={{ "--reveal-delay": `${(index % 3) * 90}ms` }}
                >
                  <span className="landing-feature-icon"><Icon aria-hidden="true" /></span>
                  <span className="landing-feature-number">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className="landing-card-arrow" aria-hidden="true"><ArrowUpRight /></span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="landing-cta-section landing-reveal">
          <div className="landing-cta-panel">
            <div className="landing-cta-glow" aria-hidden="true" />
            <div className="landing-cta-copy">
              <p className="landing-section-kicker">YOUR NEXT CHAPTER IS CLOSER</p>
              <h2>Make your next application your strongest one.</h2>
              <p>Get the clarity to move forward with confidence.</p>
            </div>
            <Link href="/analyze" className={`${buttonPrimary} landing-main-cta px-6 py-3.5`}>
              Analyze your resume <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Sparkles className="landing-cta-sparkle" aria-hidden="true" />
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-8 text-center sm:px-6 md:flex-row md:text-left">
          <div>
            <p className="landing-footer-brand">Resume Analyzer<span>.</span></p>
            <p className="text-xs text-muted">Built with Next.js and Google Gemini.</p>
          </div>
          <PrivacyNote className="max-w-lg" />
        </div>
      </footer>
    </div>
  );
}
