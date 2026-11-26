import type { CollectionConfig } from 'payload'
import { isEditor, publishedOrStaff } from '@/access/roles'
import { seoField, slugField } from '@/lib/fields'
import { revalidateAll } from '@/lib/revalidate'

export const JournalPosts: CollectionConfig = {
  slug: 'journal',
  labels: { singular: 'Journal post', plural: 'Design Journal' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    preview: (doc) => `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/en/journal/${doc.slug}`,
  },
  access: { read: publishedOrStaff, create: isEditor, update: isEditor, delete: isEditor },
  versions: { drafts: true, maxPerDoc: 25 },
  defaultSort: '-publishedAt',
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAll] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Behind the design', value: 'behind' },
        { label: 'Design experiments', value: 'experiments' },
        { label: 'New product development', value: 'development' },
        { label: 'Collection announcement', value: 'announcement' },
        { label: 'Assembly guide', value: 'assembly' },
        { label: 'Creative inspiration', value: 'inspiration' },
      ],
    },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', localized: true },
    { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    seoField,
  ],
}
