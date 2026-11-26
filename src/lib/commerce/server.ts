import 'server-only'
import { randomBytes, randomInt } from 'node:crypto'
import type { Payload } from 'payload'
import type { SiteSetting } from '@/payload-types'
import { priceCart, shippingFor, type CartItem, type Quote, type VariantFacts } from './cart'
import { payosCredentials } from './payos'

export type PaymentMethod = 'payos' | 'bank_transfer' | 'cod'

export function commerceEnabled(settings: SiteSetting) {
  return settings.mode === 'commerce'
}

/** Methods the customer may choose: switched on in Site settings and actually configured. */
export function availableMethods(settings: SiteSetting, shippingVnd: number | null): PaymentMethod[] {
  const c = settings.checkout
  const methods: PaymentMethod[] = []
  // Online payment needs a known total, so it is offered only when the shipping fee is set.
  if (c?.payos && payosCredentials() && shippingVnd !== null) methods.push('payos')
  if (c?.bankTransfer && c.bank?.accountNumber) methods.push('bank_transfer')
  if (c?.cod) methods.push('cod')
  return methods
}

export async function loadFacts(payload: Payload, items: CartItem[], locale: 'en' | 'vi'): Promise<VariantFacts[]> {
  const ids = [...new Set(items.map((i) => i.productId))]
  if (ids.length === 0) return []
  const res = await payload.find({
    collection: 'products',
    where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] },
    locale,
    depth: 0,
    limit: ids.length,
    overrideAccess: true,
  })
  return res.docs.flatMap((p) =>
    (p.variants ?? []).map((v) => ({
      productId: p.id,
      productName: p.name,
      productSlug: p.slug ?? '',
      sku: v.sku,
      variantLabel: v.label,
      priceVnd: v.priceVnd,
      stock: v.stock,
      purchasable: p.status === 'available',
    })),
  )
}

export type FullQuote = Quote & { shippingVnd: number | null; totalVnd: number; methods: PaymentMethod[] }

export async function quote(payload: Payload, settings: SiteSetting, items: CartItem[], locale: 'en' | 'vi'): Promise<FullQuote> {
  const base = priceCart(items, await loadFacts(payload, items, locale))
  const shippingVnd = base.lines.length ? shippingFor(base.subtotalVnd, settings.checkout?.shippingFlatVnd, settings.checkout?.freeShippingOverVnd) : null
  return { ...base, shippingVnd, totalVnd: base.subtotalVnd + (shippingVnd ?? 0), methods: availableMethods(settings, shippingVnd) }
}

/** 7-digit code: fits payOS's short transfer description ("SV" + code = 9 characters). */
export async function newOrderCode(payload: Payload): Promise<number> {
  for (let i = 0; i < 10; i++) {
    const code = randomInt(1_000_000, 10_000_000)
    const taken = await payload.count({ collection: 'orders', where: { 'payment.payosOrderCode': { equals: code } }, overrideAccess: true })
    if (taken.totalDocs === 0) return code
  }
  throw new Error('Could not allocate an order code')
}

export const newAccessToken = () => randomBytes(24).toString('base64url')
