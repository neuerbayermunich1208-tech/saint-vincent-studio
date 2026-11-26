import type { CollectionConfig } from 'payload'
import { isEditor, isOwner } from '@/access/roles'

/** Newsletter and release notifications. Created only by the website's server action. */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: { useAsTitle: 'email', group: 'People', defaultColumns: ['email', 'locale', 'source', 'createdAt'] },
  access: { read: isEditor, create: () => false, update: isEditor, delete: isOwner },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'locale', type: 'select', options: ['en', 'vi'], defaultValue: 'en' },
    { name: 'source', type: 'text', admin: { description: 'Where they signed up, e.g. home, upcoming, product slug.' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending confirmation', value: 'pending' },
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
      admin: { description: 'Confirmation emails are switched on once an email provider is approved.' },
    },
  ],
}
