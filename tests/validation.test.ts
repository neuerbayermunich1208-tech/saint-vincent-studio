import { describe, expect, it } from 'vitest'
import { contactSchema, subscribeSchema } from '@/lib/validation'
import { slugify } from '@/lib/slugify'
import { _resetRateLimit, rateLimit } from '@/lib/rateLimit'
import { formatDimensions, formatPrice } from '@/lib/site'

describe('subscribe validation', () => {
  it('normalises a valid email', () => {
    const r = subscribeSchema.parse({ email: '  Name@Example.COM ', locale: 'vi' })
    expect(r.email).toBe('name@example.com')
  })
  it('rejects invalid email and filled honeypot', () => {
    expect(subscribeSchema.safeParse({ email: 'nope' }).success).toBe(false)
    expect(subscribeSchema.safeParse({ email: 'a@b.co', company: 'bot' }).success).toBe(false)
  })
})

describe('contact validation', () => {
  it('requires a real message', () => {
    expect(contactSchema.safeParse({ name: 'A', email: 'a@b.co', subject: 'Hi', message: 'short' }).success).toBe(false)
    expect(contactSchema.safeParse({ name: 'A', email: 'a@b.co', subject: 'Hi', message: 'A longer message here.' }).success).toBe(true)
  })
})

describe('slugify', () => {
  it('handles Vietnamese', () => {
    expect(slugify('Thế giới thu nhỏ')).toBe('the-gioi-thu-nho')
    expect(slugify('Đèn trang trí')).toBe('den-trang-tri')
  })
})

describe('rateLimit', () => {
  it('blocks after the limit within the window', () => {
    _resetRateLimit()
    const now = 1_000
    expect(rateLimit('k', 2, 1000, now)).toBe(true)
    expect(rateLimit('k', 2, 1000, now)).toBe(true)
    expect(rateLimit('k', 2, 1000, now)).toBe(false)
    expect(rateLimit('k', 2, 1000, now + 1001)).toBe(true)
  })
})

describe('formatting', () => {
  it('formats dimensions only when present', () => {
    expect(formatDimensions({ widthMm: 120, depthMm: 80, heightMm: null })).toBe('120 × 80 mm')
    expect(formatDimensions({})).toBeNull()
  })
  it('formats VND without decimals', () => {
    expect(formatPrice(1250000, 'VND', 'vi')).toMatch(/1\.250\.000/)
  })
})
