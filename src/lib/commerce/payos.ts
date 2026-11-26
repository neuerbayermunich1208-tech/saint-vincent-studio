import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Minimal payOS client (https://payos.vn). Endpoints and signature rules follow the official @payos/node SDK:
 * - payment request signature: HMAC-SHA256 of `amount=..&cancelUrl=..&description=..&orderCode=..&returnUrl=..`
 * - webhook signature: HMAC-SHA256 of the `data` object, keys sorted, joined as `key=value&...`
 * payOS has no separate sandbox: test with a small real transfer to the studio's own linked account.
 */
const BASE_URL = process.env.PAYOS_BASE_URL || 'https://api-merchant.payos.vn'

export type PayOSCredentials = { clientId: string; apiKey: string; checksumKey: string }

export function payosCredentials(): PayOSCredentials | null {
  const clientId = process.env.PAYOS_CLIENT_ID
  const apiKey = process.env.PAYOS_API_KEY
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY
  return clientId && apiKey && checksumKey ? { clientId, apiKey, checksumKey } : null
}

const hmac = (key: string, data: string) => createHmac('sha256', key).update(data).digest('hex')

export function signPaymentRequest(
  req: { amount: number; cancelUrl: string; description: string; orderCode: number; returnUrl: string },
  checksumKey: string,
) {
  return hmac(checksumKey, `amount=${req.amount}&cancelUrl=${req.cancelUrl}&description=${req.description}&orderCode=${req.orderCode}&returnUrl=${req.returnUrl}`)
}

/** Same rules as the SDK's createSignatureFromObj: sorted keys, null → '', arrays JSON with sorted object keys. */
export function signObject(data: Record<string, unknown>, checksumKey: string) {
  const sortKeys = (o: Record<string, unknown>) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]))
  const sorted = sortKeys(data)
  const query = Object.keys(sorted)
    .filter((k) => sorted[k] !== undefined)
    .map((k) => {
      let v = sorted[k]
      if (Array.isArray(v)) v = JSON.stringify(v.map((x) => (x && typeof x === 'object' ? sortKeys(x as Record<string, unknown>) : x)))
      if (v === null || v === undefined || v === 'undefined' || v === 'null') v = ''
      return `${k}=${v}`
    })
    .join('&')
  return hmac(checksumKey, query)
}

export function safeEqualHex(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

export type PayOSWebhookData = { orderCode: number; amount: number; code: string; paymentLinkId: string; [k: string]: unknown }

/** Returns the verified webhook data, or null if the signature does not match. */
export function verifyWebhook(body: unknown, checksumKey: string): PayOSWebhookData | null {
  if (!body || typeof body !== 'object') return null
  const { data, signature } = body as { data?: unknown; signature?: unknown }
  if (!data || typeof data !== 'object' || typeof signature !== 'string' || !signature) return null
  const expected = signObject(data as Record<string, unknown>, checksumKey)
  return safeEqualHex(expected, signature) ? (data as PayOSWebhookData) : null
}

async function call<T>(creds: PayOSCredentials, path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: init?.method ?? 'GET',
    headers: { 'Content-Type': 'application/json', 'x-client-id': creds.clientId, 'x-api-key': creds.apiKey },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  })
  const json = (await res.json().catch(() => null)) as { code?: string; desc?: string; data?: T } | null
  if (!res.ok || !json || json.code !== '00' || !json.data) {
    throw new Error(`payOS ${path} failed: ${res.status} ${json?.code ?? ''} ${json?.desc ?? ''}`.trim())
  }
  return json.data
}

export type PayOSLink = { checkoutUrl: string; paymentLinkId: string; status: string; amount: number; orderCode: number }

export async function createPaymentLink(
  creds: PayOSCredentials,
  req: { orderCode: number; amount: number; description: string; returnUrl: string; cancelUrl: string; buyerName?: string; buyerEmail?: string; buyerPhone?: string; expiredAt?: number },
) {
  const signature = signPaymentRequest(req, creds.checksumKey)
  return call<PayOSLink>(creds, '/v2/payment-requests', { method: 'POST', body: { ...req, signature } })
}

export type PayOSStatus = { orderCode: number; amount: number; amountPaid: number; status: 'PENDING' | 'CANCELLED' | 'UNDERPAID' | 'PAID' | 'EXPIRED' | 'PROCESSING' | 'FAILED' }

export async function getPaymentStatus(creds: PayOSCredentials, orderCode: number) {
  return call<PayOSStatus>(creds, `/v2/payment-requests/${orderCode}`)
}
