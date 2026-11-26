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
