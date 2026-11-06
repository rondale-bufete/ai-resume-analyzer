// Recent analyses live only in this browser's localStorage — nothing is sent anywhere.
// Exposed as an external store so components read it with useSyncExternalStore.

const STORAGE_KEY = "resume-analyzer:history:v1";
export const MAX_HISTORY = 5;
const EMPTY = [];

const listeners = new Set();
let cachedRaw;
let cachedList = EMPTY;

export function resumeLabel({ file, resumeText }) {
    if (file) return file.name;
    const firstLine = resumeText.split("\n").find((line) => line.trim())?.trim() ?? "Pasted resume";
    return firstLine.length > 40 ? `${firstLine.slice(0, 40)}…` : firstLine;
}

export function parseHistory(raw) {
    if (!raw) return EMPTY;
    try {
        const list = JSON.parse(raw);
        return Array.isArray(list) ? list.filter((entry) => entry?.id && entry?.result) : EMPTY;
    } catch {
        return EMPTY;
    }
}

/** Newest first, capped. Pure so it can be tested without a browser. */
export function addHistoryEntry(list, entry, max = MAX_HISTORY) {
    return [entry, ...list.filter((item) => item.id !== entry.id)].slice(0, max);
}

/** The most recent earlier run of the same resume, used to show score changes. */
export function findPreviousRun(list, label) {
    return list.find((entry) => entry.label === label) ?? null;
}

function readRaw() {
    try {
        return window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return null; // Storage blocked (private mode, disabled cookies) — history is optional.
    }
}

function write(list) {
    try {
        if (list.length) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Quota exceeded or blocked: skip saving rather than break the analysis flow.
    }
    listeners.forEach((listener) => listener());
}

export function getHistorySnapshot() {
    const raw = readRaw();
    if (raw !== cachedRaw) {
        cachedRaw = raw;
        cachedList = parseHistory(raw);
    }
    return cachedList;
}

export function getServerHistorySnapshot() {
    return EMPTY;
}

export function subscribeHistory(listener) {
    listeners.add(listener);
    const onStorage = (event) => {
        if (event.key === STORAGE_KEY) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
    };
}

export function saveToHistory(entry) {
    write(addHistoryEntry(getHistorySnapshot(), entry));
}

export function clearHistory() {
    write(EMPTY);
}
