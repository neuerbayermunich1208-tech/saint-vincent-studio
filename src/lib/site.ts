const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || vercelUrl || 'https://saintvincent.studio').replace(/\/$/, '')

/** Search engines may index the site only when explicitly enabled (set once the real domain is live). */
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function formatDimensions(s?: { widthMm?: number | null; depthMm?: number | null; heightMm?: number | null } | null) {
  if (!s) return null
  const parts = [s.widthMm, s.depthMm, s.heightMm].filter((n): n is number => typeof n === 'number' && n > 0)
  return parts.length ? `${parts.join(' × ')} mm` : null
}

export function formatPrice(amount: number, currency: 'VND' | 'USD', locale: string) {
  return new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(currency === 'USD' ? amount / 100 : amount)
}
