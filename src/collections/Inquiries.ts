import type { CollectionConfig } from 'payload'
import { isEditor, isOwner } from '@/access/roles'

/** Messages from the contact form. */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry', plural: 'Inquiries' },
  admin: { useAsTitle: 'subject', group: 'People', defaultColumns: ['subject', 'name', 'email', 'status', 'createdAt'] },
  access: { read: isEditor, create: () => false, update: isEditor, delete: isOwner },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'topic', type: 'select', options: ['general', 'product', 'collaboration', 'press', 'order'], defaultValue: 'general' },
    { name: 'subject', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
    { name: 'locale', type: 'select', options: ['en', 'vi'] },
    { name: 'status', type: 'select', defaultValue: 'new', options: ['new', 'replied', 'closed'], admin: { position: 'sidebar' } },
  ],
}
