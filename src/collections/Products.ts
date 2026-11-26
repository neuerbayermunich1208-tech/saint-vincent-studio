import type { CollectionConfig, Field } from 'payload'
import { isEditor, isFulfilment, publishedOrStaff } from '@/access/roles'
import { seoField, slugField } from '@/lib/fields'
import { revalidateAll } from '@/lib/revalidate'

const PRODUCT_TYPES = [
  { label: 'Diorama / miniature world', value: 'diorama' },
  { label: 'Modular model / assembly kit', value: 'model_kit' },
  { label: 'Lighting object', value: 'lighting' },
  { label: 'Everyday / decorative object', value: 'object' },
  { label: 'Studio edition', value: 'edition' },
  { label: 'Other', value: 'other' },
]

const optionalText = (name: string, label: string, localized = true): Field => ({ name, label, type: 'text', localized })

/** Specs are always optional. Nothing is shown on the website until it is filled in. */
const specs: Field = {
  name: 'specs',
  type: 'group',
  admin: { description: 'Only fill in what is confirmed. Empty fields are hidden on the website.' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'widthMm', label: 'Width (mm)', type: 'number', min: 0 },
        { name: 'depthMm', label: 'Depth (mm)', type: 'number', min: 0 },
        { name: 'heightMm', label: 'Height (mm)', type: 'number', min: 0 },
        { name: 'weightG', label: 'Weight (g)', type: 'number', min: 0 },
      ],
    },
    optionalText('scale', 'Scale (e.g. 1:64)', false),
    optionalText('materials', 'Materials'),
    optionalText('finish', 'Surface finish'),
    { name: 'colors', type: 'array', fields: [{ name: 'label', type: 'text', localized: true }] },
    { name: 'includedComponents', type: 'array', fields: [{ name: 'item', type: 'text', localized: true }] },
    {
      name: 'extra',
      label: 'Other confirmed specs',
      type: 'array',
      admin: { description: 'Extra rows for the spec list, e.g. “Road width · 80 mm”. Confirmed values only.' },
      fields: [{ type: 'row', fields: [{ name: 'label', type: 'text', localized: true, required: true }, { name: 'value', type: 'text', localized: true, required: true }] }],
    },
    optionalText('packaging', 'Packaging'),
    { name: 'care', type: 'textarea', localized: true, label: 'Care instructions' },
  ],
}

const assembly: Field = {
  name: 'assembly',
  type: 'group',
  admin: { condition: (data) => ['model_kit', 'diorama', 'edition'].includes(data?.productType) },
  fields: [
    { name: 'requiresAssembly', type: 'checkbox', defaultValue: false },
    { name: 'difficulty', type: 'select', options: ['easy', 'intermediate', 'advanced'] },
    optionalText('time', 'Typical assembly time'),
    { name: 'manual', type: 'upload', relationTo: 'media', label: 'Assembly manual (PDF)' },
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'compatibleWith',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Compatible modules',
    },
  ],
}

const lighting: Field = {
  name: 'lighting',
  type: 'group',
  admin: { condition: (data) => data?.productType === 'lighting', description: 'Real, tested values only.' },
  fields: [
    optionalText('lightSource', 'Light source'),
    optionalText('power', 'Power supply (e.g. USB-C 5V)'),
    optionalText('wattage', 'Wattage'),
    optionalText('colorTemperature', 'Colour temperature (K)', false),
    optionalText('dimming', 'Dimming'),
    { name: 'safety', type: 'textarea', localized: true, label: 'Safety information and certifications (only if held)' },
  ],
}

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Catalogue',
    defaultColumns: ['name', 'catalogueNumber', 'productType', 'status', '_status'],
    preview: (doc) => `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/en/objects/${doc.slug}`,
  },
  access: { read: publishedOrStaff, create: isEditor, update: isEditor, delete: isEditor },
  versions: { drafts: { autosave: false }, maxPerDoc: 25 },
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAll] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Story',
          fields: [
            { name: 'name', type: 'text', required: true, localized: true },
            { name: 'tagline', type: 'text', localized: true },
            { name: 'story', type: 'richText', localized: true },
            { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true, admin: { description: 'Drag to reorder.' } },
            {
              name: 'photoNote',
              type: 'text',
              localized: true,
              admin: { description: 'Small line under the gallery, e.g. “Prototype shown. The release edition differs in …”. Leave empty if the photos show the final product.' },
            },
            { name: 'cardImage', type: 'upload', relationTo: 'media', admin: { description: 'Optional. Image for product cards. Defaults to the first gallery image.' } },
            { name: 'video', type: 'upload', relationTo: 'media' },
            { name: 'planImage', type: 'upload', relationTo: 'media', admin: { description: 'Optional. The image the hotspots sit on (e.g. a top-down view). Defaults to the first gallery image.' } },
            {
              name: 'hotspots',
              type: 'array',
              admin: { description: 'Numbered design notes placed on the plan image (position in %).' },
              fields: [
                { type: 'row', fields: [{ name: 'x', type: 'number', min: 0, max: 100, required: true }, { name: 'y', type: 'number', min: 0, max: 100, required: true }] },
                { name: 'title', type: 'text', localized: true },
                { name: 'body', type: 'textarea', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Details & layout',
          fields: [
            {
              name: 'detailImages',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: 'Close-ups for the “Details” block. The image caption is shown under each.' },
            },
            {
              name: 'layout',
              type: 'group',
              admin: { description: 'Optional plan diagram for sets made of several bases. Only public dimensions.' },
              fields: [
                {
                  name: 'modules',
                  type: 'array',
                  maxRows: 6,
                  fields: [{ type: 'row', fields: [{ name: 'code', type: 'text', required: true }, { name: 'name', type: 'text', localized: true }] }],
                },
                { name: 'notes', type: 'array', fields: [{ type: 'row', fields: [{ name: 'label', type: 'text', localized: true, required: true }, { name: 'value', type: 'text', required: true }] }] },
              ],
            },
          ],
        },
        { label: 'Specifications', fields: [specs, lighting, assembly] },
        {
          label: 'Variants & stock',
          fields: [
            {
              name: 'variants',
              type: 'array',
              admin: { description: 'Prices are only shown when the site is in commerce mode. VND has no decimals.' },
              access: { update: ({ req }) => Boolean(req.user) },
              fields: [
                { type: 'row', fields: [{ name: 'sku', type: 'text', required: true }, { name: 'label', type: 'text', localized: true }] },
                {
                  type: 'row',
                  fields: [
                    { name: 'priceVnd', label: 'Price (VND)', type: 'number', min: 0 },
                    { name: 'priceUsd', label: 'Price (USD, cents) — later', type: 'number', min: 0 },
                    { name: 'stock', type: 'number', min: 0, defaultValue: 0, access: { update: isFulfilment as never } },
                  ],
                },
              ],
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
    slugField('name'),
    { name: 'catalogueNumber', type: 'text', admin: { position: 'sidebar', description: 'e.g. SV-MW-001' } },
    { name: 'productType', type: 'select', required: true, defaultValue: 'diorama', options: PRODUCT_TYPES, admin: { position: 'sidebar' } },
    {
      name: 'status',
      type: 'select',
      // Own enum name: the default would collide with the drafts `_status` enum.
      enumName: 'enum_products_dev_status',
      required: true,
      defaultValue: 'concept',
      options: [
        { label: 'Concept', value: 'concept' },
        { label: 'In development', value: 'in_development' },
        { label: 'Prototype', value: 'prototype' },
        { label: 'Available', value: 'available' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar', description: '“Available” is only shown as purchasable in commerce mode.' },
    },
    { name: 'collections', type: 'relationship', relationTo: 'product-collections', hasMany: true, admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'related', type: 'relationship', relationTo: 'products', hasMany: true, admin: { position: 'sidebar' } },
  ],
}
