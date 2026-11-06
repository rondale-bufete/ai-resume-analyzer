import Link from "next/link";

export default function SiteHeader({ action }) {
    return (
        <header className="border-b border-line px-4 py-4 sm:px-6 print:hidden">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                <Link
                    href="/"
                    className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                    <span
                        aria-hidden="true"
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-sm font-bold text-on-accent"
                    >
                        R
                    </span>
                    <span className="font-display text-lg tracking-tight">Resume Analyzer</span>
                </Link>
                {action}
            </div>
        </header>
    );
}
