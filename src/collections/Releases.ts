import type { CollectionConfig } from 'payload'
import { isEditor, visibleOrStaff } from '@/access/roles'
import { revalidateAll } from '@/lib/revalidate'

export const Releases: CollectionConfig = {
  slug: 'releases',
  labels: { singular: 'Upcoming release', plural: 'Upcoming releases' },
  admin: { useAsTitle: 'title', group: 'Catalogue', defaultColumns: ['title', 'stage', 'releaseDate', 'visible'] },
  access: { read: visibleOrStaff, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: 'order',
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAll] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'product', type: 'relationship', relationTo: 'products' },
    { name: 'collection', type: 'relationship', relationTo: 'product-collections' },
    { name: 'catalogueNumber', type: 'text' },
    {
      name: 'stage',
      type: 'select',
      required: true,
      defaultValue: 'concept',
      options: [
        { label: 'Concept', value: 'concept' },
        { label: 'Design', value: 'design' },
        { label: 'Prototype', value: 'prototype' },
        { label: 'Refine', value: 'refine' },
        { label: 'Production', value: 'production' },
      ],
    },
    {
      name: 'releaseDate',
      type: 'date',
      admin: { description: 'Leave empty until the date is confirmed. The website then says “To be announced”.' },
    },
    { name: 'note', type: 'textarea', localized: true },
    { name: 'visible', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
