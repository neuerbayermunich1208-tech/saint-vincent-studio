import { describe, expect, it } from 'vitest'
import { normaliseCart, priceCart, shippingFor, type VariantFacts } from '@/lib/commerce/cart'
import { signObject, signPaymentRequest, verifyWebhook } from '@/lib/commerce/payos'

const facts: VariantFacts[] = [
  { productId: 1, productName: 'The Corner', productSlug: 'the-corner', sku: 'A', priceVnd: 500_000, stock: 3, purchasable: true },
  { productId: 2, productName: 'Lamp', productSlug: 'lamp', sku: 'B', priceVnd: null, stock: 5, purchasable: true },
  { productId: 3, productName: 'Kit', productSlug: 'kit', sku: 'C', priceVnd: 100_000, stock: 0, purchasable: true },
  { productId: 4, productName: 'Concept', productSlug: 'concept', sku: 'D', priceVnd: 100_000, stock: 9, purchasable: false },
]

describe('normaliseCart', () => {
  it('merges duplicates, clamps quantities and drops junk', () => {
    const items = normaliseCart([
      { productId: 1, sku: 'A', quantity: 2 },
      { productId: '1', sku: 'A', quantity: 20 },
      { productId: -1, sku: 'A', quantity: 1 },
      { productId: 2, sku: '', quantity: 1 },
      'junk',
    ])
    expect(items).toEqual([{ productId: 1, sku: 'A', quantity: 10 }])
    expect(normaliseCart('nope')).toEqual([])
  })
})

describe('priceCart', () => {
  it('uses server prices and reports problems', () => {
    const q = priceCart(
      [
        { productId: 1, sku: 'A', quantity: 2 },
        { productId: 2, sku: 'B', quantity: 1 },
        { productId: 3, sku: 'C', quantity: 1 },
        { productId: 4, sku: 'D', quantity: 1 },
        { productId: 9, sku: 'Z', quantity: 1 },
      ],
      facts,
    )
    expect(q.subtotalVnd).toBe(1_000_000)
    expect(q.lines).toHaveLength(1)
    expect(q.problems.map((p) => p.reason)).toEqual(['noPrice', 'outOfStock', 'unavailable', 'unavailable'])
  })
  it('flags quantities above stock', () => {
    const q = priceCart([{ productId: 1, sku: 'A', quantity: 4 }], facts)
    expect(q.problems).toEqual([{ productId: 1, sku: 'A', reason: 'limitedStock', available: 3 }])
  })
})

describe('shippingFor', () => {
  it('returns null when the studio has not set a fee', () => {
    expect(shippingFor(100, null, null)).toBeNull()
    expect(shippingFor(100, 30_000, null)).toBe(30_000)
    expect(shippingFor(2_000_000, 30_000, 1_000_000)).toBe(0)
  })
})

describe('payOS signatures', () => {
  const key = 'test-checksum-key'
  it('signs payment requests in the documented field order', () => {
    const a = signPaymentRequest({ amount: 1000, cancelUrl: 'c', description: 'd', orderCode: 1, returnUrl: 'r' }, key)
    expect(a).toMatch(/^[a-f0-9]{64}$/)
    expect(a).toBe(signObject({ returnUrl: 'r', orderCode: 1, description: 'd', cancelUrl: 'c', amount: 1000 }, key))
  })
  it('accepts a correctly signed webhook and rejects tampering', () => {
    const data = { orderCode: 123, amount: 2000, code: '00', paymentLinkId: 'x', counterAccountName: null }
    const body = { code: '00', data, signature: signObject(data, key) }
    expect(verifyWebhook(body, key)?.orderCode).toBe(123)
    expect(verifyWebhook({ ...body, data: { ...data, amount: 1 } }, key)).toBeNull()
    expect(verifyWebhook({ data }, key)).toBeNull()
  })
})
