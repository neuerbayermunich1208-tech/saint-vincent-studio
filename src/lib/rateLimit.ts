/**
 * Small fixed-window rate limiter kept in memory.
 * Good enough for one server; swap for a shared store (e.g. Redis) when running several instances.
 */
type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    if (buckets.size > 10_000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
    }
    return true
  }
  if (bucket.count >= limit) return false
  bucket.count += 1
  return true
}

export function _resetRateLimit() {
  buckets.clear()
}
