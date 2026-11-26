import type { Payload, PayloadRequest } from 'payload'

type Line = { product?: number | { id: number } | null; sku: string; quantity: number }

/**
 * Moves stock for order lines: direction -1 reserves (order placed), +1 returns (order cancelled).
 * Only the `stock` number of the matching variant changes. Returns false if a reservation would go below zero.
 */
export async function moveStock(payload: Payload, lines: Line[], direction: 1 | -1, req?: Partial<PayloadRequest>): Promise<boolean> {
  const byProduct = new Map<number, Line[]>()
  for (const l of lines) {
    const id = typeof l.product === 'object' ? l.product?.id : l.product
    if (!id) continue
    byProduct.set(id, [...(byProduct.get(id) ?? []), l])
  }
  for (const [id, productLines] of byProduct) {
    const product = await payload.findByID({ collection: 'products', id, depth: 0, overrideAccess: true, req })
    const variants = (product.variants ?? []).map((v) => ({ id: v.id, stock: v.stock ?? 0, sku: v.sku }))
    for (const l of productLines) {
      const v = variants.find((x) => x.sku === l.sku)
      if (!v) continue
      const next = v.stock + direction * l.quantity
      if (next < 0) return false
      v.stock = next
    }
    await payload.update({
      collection: 'products',
      id,
      depth: 0,
      overrideAccess: true,
      req,
      // Only id + stock per row: array rows are matched by id, so names, labels and prices stay as they are.
      data: { variants: variants.map(({ id: rowId, stock, sku }) => ({ id: rowId, stock, sku })) } as never,
      context: { stockOnly: true },
    })
  }
  return true
}
