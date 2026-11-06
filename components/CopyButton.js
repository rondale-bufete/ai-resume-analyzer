"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { buttonSecondary } from "./ui";

export default function CopyButton({ text, label = "Copy" }) {
    const [status, setStatus] = useState("idle");
    const resetTimer = useRef(null);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(text);
            setStatus("copied");
        } catch {
            setStatus("failed");
        }
        clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(() => setStatus("idle"), 2000);
    }

    return (
        <button type="button" onClick={handleCopy} className={`${buttonSecondary} min-h-9 px-3 text-xs print:hidden`}>
            {status === "copied" ? (
                <Check aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
            ) : (
                <Copy aria-hidden="true" className="h-3.5 w-3.5" />
            )}
            <span aria-live="polite">{status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : label}</span>
        </button>
    );
}
