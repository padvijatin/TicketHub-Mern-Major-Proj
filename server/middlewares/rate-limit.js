const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX = 30;

const createEntry = (now, windowMs) => ({
  count: 0,
  resetAt: now + windowMs,
});

const buildRateLimiter = ({
  windowMs = DEFAULT_WINDOW_MS,
  max = DEFAULT_MAX,
  message = "Too many requests. Please try again later.",
} = {}) => {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key =
      String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
      req.ip ||
      req.connection?.remoteAddress ||
      "unknown";
    const entry = hits.get(key) || createEntry(now, windowMs);

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count += 1;
    hits.set(key, entry);

    res.set("X-RateLimit-Limit", String(max));
    res.set("X-RateLimit-Remaining", String(Math.max(0, max - entry.count)));
    res.set("X-RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > max) {
      return res.status(429).json({ message });
    }

    if (hits.size > 10000) {
      for (const [storedKey, storedEntry] of hits) {
        if (storedEntry.resetAt < now) {
          hits.delete(storedKey);
        }
      }
    }

    return next();
  };
};

module.exports = {
  buildRateLimiter,
};

