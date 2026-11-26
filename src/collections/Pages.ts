import type { CollectionConfig } from 'payload'
import { isEditor, publishedOrStaff } from '@/access/roles'
import { seoField, slugField } from '@/lib/fields'
import { revalidateAll } from '@/lib/revalidate'

/** Legal and support pages: privacy, terms, shipping, returns, care, FAQ intro. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'section', '_status'] },
  access: { read: publishedOrStaff, create: isEditor, update: isEditor, delete: isEditor },
  versions: { drafts: true },
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAll] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    {
      name: 'section',
      type: 'select',
      required: true,
      defaultValue: 'support',
      options: [
        { label: 'Legal', value: 'legal' },
        { label: 'Support', value: 'support' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'body', type: 'richText', localized: true },
    seoField,
  ],
}
