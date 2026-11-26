'use server'

import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { getSiteSettings } from '@/lib/data'
import { rateLimit } from '@/lib/rateLimit'
import { checkoutSchema } from '@/lib/validation'
import { normaliseCart } from '@/lib/commerce/cart'
import { createPaymentLink, payosCredentials } from '@/lib/commerce/payos'
import { commerceEnabled, newAccessToken, newOrderCode, quote, type FullQuote } from '@/lib/commerce/server'
import { moveStock } from '@/lib/commerce/stock'

export async function quoteCart(rawItems: unknown, locale: 'en' | 'vi'): Promise<FullQuote | null> {
  const settings = await getSiteSettings()
  if (!commerceEnabled(settings)) return null
  const payload = await getPayloadClient()
  return quote(payload, settings, normaliseCart(rawItems), locale === 'vi' ? 'vi' : 'en')
}

export type CheckoutState =
  | { status: 'idle'; values?: Record<string, string> }
  | { status: 'invalid'; fields: string[]; values?: Record<string, string> }
  | { status: 'cartChanged' | 'methodUnavailable' | 'rateLimited' | 'closed' | 'error' | 'paymentError'; values?: Record<string, string> }
  | { status: 'redirect'; url: string }

async function requestOrigin() {
  const h = await headers()
  const host = h.get('x-forwarded-host') || h.get('host')
  const proto = h.get('x-forwarded-proto') || (host?.startsWith('localhost') ? 'http' : 'https')
  return { origin: `${proto}://${host}`, ip: h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown' }
}

export async function placeOrder(prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const result = await placeOrderInner(formData)
  if (result.status === 'redirect') return result
  // React resets the form after an action; sending the typed values back keeps them in the fields.
  const values = Object.fromEntries(['name', 'phone', 'email', 'address', 'ward', 'district', 'province', 'note', 'method'].map((k) => [k, String(formData.get(k) ?? '').slice(0, 500)]))
  void prev
  return { ...result, values }
}

async function placeOrderInner(formData: FormData): Promise<CheckoutState> {
  const raw = Object.fromEntries(['name', 'phone', 'email', 'address', 'ward', 'district', 'province', 'note', 'method', 'locale', 'company'].map((k) => [k, (formData.get(k) as string | null) || undefined]))
  const parsed = checkoutSchema.safeParse(raw)
  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === 'company')) return { status: 'error' }
    return { status: 'invalid', fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))] }
  }
  const input = parsed.data
  const { origin, ip } = await requestOrigin()
  if (!rateLimit(`checkout:${ip}`, 5, 10 * 60_000)) return { status: 'rateLimited' }

  const settings = await getSiteSettings()
  if (!commerceEnabled(settings)) return { status: 'closed' }

  let items
  try {
    items = normaliseCart(JSON.parse(String(formData.get('cart') ?? '[]')))
  } catch {
    return { status: 'cartChanged' }
  }
  const payload = await getPayloadClient()
  const q = await quote(payload, settings, items, input.locale)
  // The customer confirms the total they saw; any change in price, stock or availability sends them back to review.
  if (q.lines.length === 0 || q.problems.length > 0 || Number(formData.get('expectedTotal')) !== q.totalVnd) return { status: 'cartChanged' }
  if (!q.methods.includes(input.method)) return { status: 'methodUnavailable' }

  const code = await newOrderCode(payload)
  const orderNumber = `SV${code}`
  const accessToken = newAccessToken()
  const lines = q.lines.map((l) => ({ product: l.productId, productName: l.productName, sku: l.sku, variantLabel: l.variantLabel, unitPriceVnd: l.unitPriceVnd, quantity: l.quantity, lineTotalVnd: l.lineTotalVnd }))

  if (!(await moveStock(payload, lines, -1))) return { status: 'cartChanged' }

  let orderId: number
  try {
    const order = await payload.create({
      collection: 'orders',
      overrideAccess: true,
      data: {
        orderNumber,
        status: input.method === 'payos' ? 'pending_payment' : input.method === 'bank_transfer' ? 'awaiting_transfer' : 'confirmed',
        paymentMethod: input.method,
        customer: { name: input.name, phone: input.phone, email: input.email },
        shipping: { address: input.address, ward: input.ward, district: input.district, province: input.province, note: input.note },
        items: lines,
        subtotalVnd: q.subtotalVnd,
        shippingVnd: q.shippingVnd,
        totalVnd: q.totalVnd,
        payment: { payosOrderCode: code },
        locale: input.locale,
        stockReserved: true,
        accessToken,
      },
    })
    orderId = order.id
  } catch (err) {
    console.error('[checkout] order create failed', err)
    await moveStock(payload, lines, 1)
    return { status: 'error' }
  }

  const orderUrl = `${origin}/${input.locale}/order/${orderNumber}?t=${accessToken}`
  if (input.method !== 'payos') return { status: 'redirect', url: orderUrl }

  const creds = payosCredentials()
  try {
    if (!creds) throw new Error('payOS keys missing')
    const link = await createPaymentLink(creds, {
      orderCode: code,
      amount: q.totalVnd,
      description: orderNumber,
      returnUrl: orderUrl,
      cancelUrl: `${orderUrl}&cancelled=1`,
      buyerName: input.name,
      buyerEmail: input.email,
      buyerPhone: input.phone,
      expiredAt: Math.floor(Date.now() / 1000) + 30 * 60,
    })
    await payload.update({ collection: 'orders', id: orderId, overrideAccess: true, data: { payment: { payosOrderCode: code, payosPaymentLinkId: link.paymentLinkId, checkoutUrl: link.checkoutUrl } } })
    return { status: 'redirect', url: link.checkoutUrl }
  } catch (err) {
    console.error('[checkout] payOS link failed', err)
    // Cancelling returns the reserved stock (Orders afterChange hook).
    await payload.update({ collection: 'orders', id: orderId, overrideAccess: true, data: { status: 'cancelled', internalNotes: 'payOS payment link could not be created.' } })
    return { status: 'paymentError' }
  }
}
