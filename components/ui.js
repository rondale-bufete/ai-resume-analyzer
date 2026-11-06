// Shared class recipes so buttons and cards look the same everywhere.
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export const buttonPrimary = `inline-flex items-center justify-center gap-2 rounded-lg bg-accent font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;

export const buttonSecondary = `inline-flex items-center justify-center gap-1.5 rounded-md border border-line bg-white/[0.03] text-ink-soft transition-colors hover:border-accent/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;

export const linkButton = `inline-flex items-center gap-1 rounded text-accent hover:underline ${focusRing}`;

export const card = "rounded-xl border border-line bg-surface";

export const sectionTitle = "text-sm font-medium text-ink";
