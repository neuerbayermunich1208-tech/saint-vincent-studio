'use server'

import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { rateLimit } from '@/lib/rateLimit'
import { contactSchema } from '@/lib/validation'
import type { FormState } from './subscribe'

export async function sendInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(['name', 'email', 'topic', 'subject', 'message', 'locale', 'company'].map((k) => [k, formData.get(k) || undefined]))
  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === 'company')) return { status: 'success' }
    return { status: 'invalid', fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))] }
  }
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!rateLimit(`contact:${ip}`, 3, 10 * 60_000)) return { status: 'rateLimited' }

  try {
    const payload = await getPayloadClient()
    const { company: _c, ...data } = parsed.data
    await payload.create({ collection: 'inquiries', overrideAccess: true, data: { ...data, status: 'new' } })
    return { status: 'success' }
  } catch (err) {
    console.error('[contact] failed', err)
    return { status: 'error' }
  }
}
