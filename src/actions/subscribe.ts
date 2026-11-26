'use server'

import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { rateLimit } from '@/lib/rateLimit'
import { subscribeSchema } from '@/lib/validation'

export type FormState = { status: 'idle' | 'success' | 'already' | 'invalid' | 'rateLimited' | 'error'; fields?: string[] }

async function clientKey(prefix: string) {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  return `${prefix}:${ip}`
}

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = subscribeSchema.safeParse({
    email: formData.get('email'),
    locale: formData.get('locale'),
    source: formData.get('source') || undefined,
    company: formData.get('company') || undefined,
  })
  if (!parsed.success) {
    // A filled honeypot looks like success to bots, but nothing is stored.
    if (parsed.error.issues.some((i) => i.path[0] === 'company')) return { status: 'success' }
    return { status: 'invalid' }
  }
  if (!rateLimit(await clientKey('subscribe'), 5, 60_000)) return { status: 'rateLimited' }

  try {
    const payload = await getPayloadClient()
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: parsed.data.email } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.totalDocs > 0) return { status: 'already' }
    await payload.create({
      collection: 'subscribers',
      overrideAccess: true,
      data: { email: parsed.data.email, locale: parsed.data.locale, source: parsed.data.source, status: 'pending' },
    })
    return { status: 'success' }
  } catch (err) {
    console.error('[subscribe] failed', err)
    return { status: 'error' }
  }
}
