import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "AI Resume Analyzer",
  description: "Instant AI-powered resume feedback and job match scoring.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-[#0F1210] text-[#EDECE9] font-[family-name:var(--font-body)] antialiased">
        {children}
      </body>
    </html>
  );
}