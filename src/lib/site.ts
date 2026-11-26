export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saintvincent.studio').replace(/\/$/, '')

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
