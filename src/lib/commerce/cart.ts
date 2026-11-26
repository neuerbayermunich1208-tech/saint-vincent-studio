/** Shared cart types and the pure pricing rules. Safe to import from client and server. */

export type CartItem = { productId: number; sku: string; quantity: number }

export const MAX_QTY_PER_LINE = 10
export const MAX_LINES = 20

/** The facts the server knows about a variant at the moment of pricing. */
export type VariantFacts = {
  productId: number
  productName: string
  productSlug: string
  sku: string
  variantLabel?: string | null
  priceVnd?: number | null
  stock?: number | null
  purchasable: boolean
}

export type PricedLine = {
  productId: number
  productName: string
  productSlug: string
  sku: string
  variantLabel?: string | null
  unitPriceVnd: number
  quantity: number
  lineTotalVnd: number
}

export type LineProblem = { productId: number; sku: string; reason: 'unavailable' | 'noPrice' | 'outOfStock' | 'limitedStock'; available?: number }

export type Quote = { lines: PricedLine[]; problems: LineProblem[]; subtotalVnd: number }

/** Merges duplicate lines and clamps quantities. Never trusts what the browser sent. */
export function normaliseCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return []
  const merged = new Map<string, CartItem>()
  for (const entry of raw.slice(0, 100)) {
    if (!entry || typeof entry !== 'object') continue
    const { productId, sku, quantity } = entry as Record<string, unknown>
    const id = Number(productId)
    const qty = Math.floor(Number(quantity))
    if (!Number.isInteger(id) || id <= 0 || typeof sku !== 'string' || !sku || sku.length > 64 || !Number.isFinite(qty) || qty < 1) continue
    const key = `${id}:${sku}`
    const prev = merged.get(key)
    merged.set(key, { productId: id, sku, quantity: Math.min(MAX_QTY_PER_LINE, (prev?.quantity ?? 0) + qty) })
  }
  return [...merged.values()].slice(0, MAX_LINES)
}

/** Prices a cart against server facts. Lines that cannot be sold are reported, not silently dropped. */
export function priceCart(items: CartItem[], facts: VariantFacts[]): Quote {
  const lines: PricedLine[] = []
  const problems: LineProblem[] = []
  for (const item of items) {
    const f = facts.find((v) => v.productId === item.productId && v.sku === item.sku)
    if (!f || !f.purchasable) {
      problems.push({ productId: item.productId, sku: item.sku, reason: 'unavailable' })
      continue
    }
    if (typeof f.priceVnd !== 'number' || f.priceVnd <= 0) {
      problems.push({ productId: item.productId, sku: item.sku, reason: 'noPrice' })
      continue
    }
    const stock = Math.max(0, Math.floor(f.stock ?? 0))
    if (stock === 0) {
      problems.push({ productId: item.productId, sku: item.sku, reason: 'outOfStock' })
      continue
    }
    if (item.quantity > stock) {
      problems.push({ productId: item.productId, sku: item.sku, reason: 'limitedStock', available: stock })
      continue
    }
    lines.push({
      productId: f.productId,
      productName: f.productName,
      productSlug: f.productSlug,
      sku: f.sku,
      variantLabel: f.variantLabel,
      unitPriceVnd: f.priceVnd,
      quantity: item.quantity,
      lineTotalVnd: f.priceVnd * item.quantity,
    })
  }
  return { lines, problems, subtotalVnd: lines.reduce((sum, l) => sum + l.lineTotalVnd, 0) }
}

/** Shipping: a flat fee set by the studio, optionally free above a threshold. Null means "confirmed by the studio". */
export function shippingFor(subtotalVnd: number, flatFeeVnd?: number | null, freeOverVnd?: number | null): number | null {
  if (typeof freeOverVnd === 'number' && freeOverVnd > 0 && subtotalVnd >= freeOverVnd) return 0
  if (typeof flatFeeVnd === 'number' && flatFeeVnd >= 0) return flatFeeVnd
  return null
}
