/**
 * Sliding-window limiter kept in memory. On serverless hosts each instance has its own
 * memory, so this is a first line of defence against quota draining, not a hard global cap.
 * Swap in a shared store (e.g. Upstash Redis) if the app gets real traffic.
 */
export function createRateLimiter({ limit, windowMs, now = Date.now, maxKeys = 5000 }) {
    const hits = new Map();

    return function check(key) {
        const time = now();
        const recent = (hits.get(key) ?? []).filter((ts) => time - ts < windowMs);

        if (recent.length >= limit) {
            hits.set(key, recent);
            const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (time - recent[0])) / 1000));
            return { allowed: false, retryAfterSeconds };
        }

        recent.push(time);
        hits.set(key, recent);

        if (hits.size > maxKeys) {
            // Map preserves insertion order, so the first key is the oldest.
            hits.delete(hits.keys().next().value);
        }

        return { allowed: true, remaining: limit - recent.length };
    };
}
