import { z } from 'zod'

export const emailSchema = z.string().trim().toLowerCase().max(254).email()

export const subscribeSchema = z.object({
  email: emailSchema,
  locale: z.enum(['en', 'vi']).default('en'),
  source: z.string().trim().max(80).optional(),
  // Honeypot: real people never see or fill this field.
  company: z.string().max(0).optional(),
})

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: emailSchema,
  topic: z.enum(['general', 'product', 'collaboration', 'press', 'order']).default('general'),
  subject: z.string().trim().min(1).max(160),
  message: z.string().trim().min(10).max(5000),
  locale: z.enum(['en', 'vi']).default('en'),
  company: z.string().max(0).optional(),
})

export type SubscribeInput = z.infer<typeof subscribeSchema>
export type ContactInput = z.infer<typeof contactSchema>

export const checkoutSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(/^[0-9+().\s-]{8,20}$/),
  email: emailSchema,
  address: z.string().trim().min(5).max(200),
  ward: z.string().trim().max(100).optional(),
  district: z.string().trim().max(100).optional(),
  province: z.string().trim().min(2).max(100),
  note: z.string().trim().max(500).optional(),
  method: z.enum(['payos', 'bank_transfer', 'cod']),
  locale: z.enum(['en', 'vi']).default('en'),
  company: z.string().max(0).optional(),
})
export type CheckoutInput = z.infer<typeof checkoutSchema>
