import 'server-only'
import type { Payload } from 'payload'
import type { Order } from '@/payload-types'
import { getPaymentStatus, payosCredentials } from './payos'

/**
 * Asks payOS for the real state of an online order and records it. Never trusts the return URL alone.
 * PAID with the full amount → paid. CANCELLED / EXPIRED / FAILED → cancelled (stock returned by the Orders hook).
 */
export async function syncPayosOrder(payload: Payload, order: Order): Promise<Order> {
  if (order.paymentMethod !== 'payos' || order.status !== 'pending_payment' || !order.payment?.payosOrderCode) return order
  const creds = payosCredentials()
  if (!creds) return order
  try {
    const s = await getPaymentStatus(creds, order.payment.payosOrderCode)
    if (s.status === 'PAID' && s.amountPaid >= order.totalVnd) {
      return await payload.update({
        collection: 'orders',
        id: order.id,
        overrideAccess: true,
        data: { status: 'paid', payment: { ...order.payment, paidAt: new Date().toISOString() } },
      })
    }
    if (s.status === 'CANCELLED' || s.status === 'EXPIRED' || s.status === 'FAILED') {
      return await payload.update({ collection: 'orders', id: order.id, overrideAccess: true, data: { status: 'cancelled' } })
    }
  } catch (err) {
    console.error('[payos] status check failed', err)
  }
  return order
}
