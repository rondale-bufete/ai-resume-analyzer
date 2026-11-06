import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "AI Resume Analyzer",
  description: "Instant AI-powered resume feedback, ATS checks and job match scoring.",
  openGraph: {
    title: "AI Resume Analyzer",
    description: "Know exactly what to fix in your resume, before a recruiter does.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0b110d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-bg text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
