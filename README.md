# Resume Analyzer

An AI-powered resume review tool that gives structured feedback, ATS formatting warnings, job description match scoring and one-click rewrites.

**Live demo:** https://ai-resume-analyzer-lovat-beta.vercel.app

## Overview

Users submit a resume as pasted text, a PDF or a Word (.docx) file, and optionally a job description. The app sends it to Gemini and returns a structured breakdown: an overall score with four sub-scores, strengths and weaknesses, ATS risks ranked by severity, section-by-section feedback and before/after rewrite suggestions. With a job description it also returns a match score, matching and missing skills, a keyword map of the job post, a tailored professional summary and a cover letter opener.

## Features

- Resume input by pasted text, PDF or DOCX upload, including drag-and-drop
- PDFs go straight to Gemini for native document understanding; DOCX text is extracted on the server with mammoth
- Schema-enforced AI output, cleaned on the server (scores clamped, empty items dropped)
- Score breakdown: impact, clarity, ATS formatting and keywords
- ATS risks with high / medium / low severity
- Keyword map that highlights matched and missing job-post keywords
- Rewrite suggestions you can copy or apply directly to your pasted resume, then re-analyze to see the score change
- Tailored summary and cover letter opener (built only from facts in the resume)
- Recent analyses saved in the browser (localStorage, last 5) with score changes between runs
- Print / Save as PDF report with a light print layout
- Accessible: labelled fields, keyboard-reachable upload, screen-reader announcements, reduced-motion support

## Tech stack

- Next.js (App Router), React 19 with the React Compiler
- Google Gemini API (`@google/genai`)
- Tailwind CSS v4 (design tokens in `app/globals.css`)
- mammoth (DOCX text extraction), lucide-react (icons)
- Vitest (unit tests)

## Running locally

```bash
npm install
npm run dev
```

Requires a `.env.local` with:

```
GEMINI_API_KEY=your_key_here
# optional, defaults to gemini-3.5-flash
GEMINI_MODEL=gemini-3.5-flash
```

Get a free key from [Google AI Studio](https://aistudio.google.com).

Other scripts: `npm test` (unit tests), `npm run lint`, `npm run build`.

## Limits and safeguards

- Files up to 4 MB; resume text up to 20,000 characters; job description up to 10,000
- Uploads are checked by content (PDF / DOCX signatures), not just by file extension
- 5 analyses per minute per IP (in-memory, per server instance; use a shared store such as Upstash Redis for a hard global limit)
- Instructions go to Gemini as a system instruction, separate from resume and job text, to resist prompt injection

## Privacy

Resumes are sent to Google Gemini for analysis and are not saved by this app on any server. On Gemini's free tier, Google may use submitted content to improve its services. Recent results are stored only in the user's own browser and can be cleared from the page.

## Known limitations

- No accounts; history lives in one browser only
- Free-tier Gemini rate limits apply
- Scanned (image-only) PDFs may produce weaker results; pasting the text works better
