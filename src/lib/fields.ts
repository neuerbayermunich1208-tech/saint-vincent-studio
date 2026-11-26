import type { Field } from 'payload'
import { slugify } from './slugify'

/** URL slug, generated from `name`/`title` when left empty. Not localized so URLs stay stable. */
export const slugField = (from = 'name'): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  required: true,
  admin: { position: 'sidebar', description: 'Used in the URL. Lowercase letters, numbers and hyphens.' },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const source = data?.[from]
        if (typeof source === 'string') return slugify(source)
        if (source && typeof source === 'object') {
          const first = Object.values(source as Record<string, unknown>).find((v) => typeof v === 'string')
          if (typeof first === 'string') return slugify(first)
        }
        return value
      },
    ],
  },
})

export const seoField: Field = {
  name: 'seo',
  type: 'group',
  admin: { description: 'Search and social preview. Leave empty to use the title and summary.' },
  fields: [
    { name: 'title', type: 'text', localized: true, maxLength: 70 },
    { name: 'description', type: 'textarea', localized: true, maxLength: 170 },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'noIndex', type: 'checkbox', defaultValue: false, label: 'Hide from search engines' },
  ],
}
