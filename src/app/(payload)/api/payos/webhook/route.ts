import { getPayloadClient } from '@/lib/payload'
import { payosCredentials, verifyWebhook } from '@/lib/commerce/payos'
import { syncPayosOrder } from '@/lib/commerce/sync'

/**
 * payOS webhook. Register https://<site>/api/payos/webhook in the payOS dashboard.
 * The signature is checked, then the payment is re-confirmed with payOS before the order is marked paid.
 */
export async function POST(request: Request) {
  const creds = payosCredentials()
  if (!creds) return Response.json({ error: 'payOS not configured' }, { status: 503 })
  const body = await request.json().catch(() => null)
  const data = verifyWebhook(body, creds.checksumKey)
  if (!data) return Response.json({ error: 'invalid signature' }, { status: 400 })

  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'orders', where: { 'payment.payosOrderCode': { equals: data.orderCode } }, limit: 1, overrideAccess: true, depth: 0 })
  const order = res.docs[0]
  // payOS sends a test event when the webhook URL is saved; unknown order codes are acknowledged and ignored.
  if (order && data.code === '00') {
    const synced = await syncPayosOrder(payload, order)
    if (synced.status === 'paid' && typeof data.reference === 'string') {
      await payload.update({ collection: 'orders', id: order.id, overrideAccess: true, data: { payment: { ...synced.payment, reference: data.reference } } })
    }
  }
  return Response.json({ success: true })
}
