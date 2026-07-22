# Resume Analyzer

An AI-powered resume review tool that gives structured feedback, ATS formatting warnings, and job description match scoring.

**Live demo:** https://ai-resume-analyzer-lovat-beta.vercel.app

## Overview

Users submit a resume, either as pasted text or a PDF upload, and optionally a job description. The app sends this to Gemini and returns a structured breakdown: an overall score, strengths and weaknesses, ATS formatting risks, section-by-section feedback, specific rewrite suggestions with before/after text, and — if a job description is provided — a match score with matching and missing skills.

## Features

- Resume input via pasted text or PDF upload, including drag-and-drop
- PDF resumes are sent directly to Gemini for native document understanding, with no separate text-extraction step
- Structured, schema-enforced AI output (not freeform text parsing)
- Circular score gauges for overall quality and job match
- Section-by-section feedback and concrete rewrite suggestions with reasoning
- ATS formatting risk warnings (tables, non-standard structure, missing keywords)

## Tech stack

- Next.js (App Router)
- Google Gemini API
- Tailwind CSS

## Running locally

```bash
npm install
npm run dev
```

Requires a `.env.local` with:

```
GEMINI_API_KEY=your_key_here
```

Get a free key from [Google AI Studio](https://aistudio.google.com) — no billing required for the free tier.

## Known limitations

- No analysis history or accounts; each session is stateless by design
- Free-tier Gemini rate limits apply (currently 1,500 requests/day)
- Very large or image-heavy PDF resumes may take longer to process or occasionally reduce output quality
