import type { CollectionConfig } from 'payload'
import { isEditor, visibleOrStaff } from '@/access/roles'
import { seoField, slugField } from '@/lib/fields'
import { revalidateAll } from '@/lib/revalidate'

export const ProductCollections: CollectionConfig = {
  slug: 'product-collections',
  labels: { singular: 'Collection', plural: 'Collections' },
  admin: { useAsTitle: 'name', group: 'Catalogue', defaultColumns: ['name', 'code', 'visible', 'order'] },
  access: { read: visibleOrStaff, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: 'order',
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAll] },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    slugField('name'),
    {
      name: 'code',
      type: 'text',
      admin: { position: 'sidebar', description: 'Catalogue prefix, e.g. MW for Miniature Worlds (used in SV-MW-001).' },
    },
    { name: 'visible', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', description: 'Untick to hide without deleting.' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'parent', type: 'relationship', relationTo: 'product-collections', admin: { position: 'sidebar' } },
    { name: 'summary', type: 'textarea', localized: true },
    {
      name: 'themes',
      type: 'array',
      label: 'Sub-themes',
      fields: [{ name: 'label', type: 'text', localized: true }],
    },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    {
      name: 'collectorMode',
      type: 'checkbox',
      defaultValue: false,
      label: 'Collector presentation',
      admin: { description: 'Shows catalogue numbers and the drop board style (used for Miniature Worlds, Studio Editions).' },
    },
    seoField,
  ],
}
