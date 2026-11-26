import type { GlobalConfig } from 'payload'
import { isEditor } from '@/access/roles'
import { revalidateGlobal } from '@/lib/revalidate'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Home page',
  admin: { group: 'Content', description: 'Text and highlights for the home page. Collections, releases and journal posts update automatically.' },
  access: { read: () => true, update: isEditor },
  versions: { drafts: true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroLines',
              type: 'array',
              minRows: 1,
              maxRows: 4,
              admin: { description: 'Each line of the big headline. Tick “italic” for emphasis.' },
              fields: [
                { name: 'text', type: 'text', localized: true },
                { name: 'italic', type: 'checkbox', defaultValue: false },
                { name: 'indent', type: 'checkbox', defaultValue: false },
              ],
            },
            { name: 'heroLede', type: 'textarea', localized: true },
            { name: 'heroImage', type: 'upload', relationTo: 'media', admin: { description: 'Optional. Without it, the studio drawing is shown.' } },
            {
              name: 'heroLayout',
              type: 'select',
              defaultValue: 'portrait',
              options: [
                { label: 'Portrait image beside the headline', value: 'portrait' },
                { label: 'Wide image across the page, headline below', value: 'wide' },
              ],
            },
            { name: 'heroLabel', type: 'text', localized: true, admin: { description: 'Small mono line above the headline, e.g. “SM-01 + SM-02 · Prototype”.' } },
            { name: 'heroNote', type: 'text', localized: true, admin: { description: 'Small line under the hero image, e.g. a prototype note.' } },
            { name: 'heroProduct', type: 'relationship', relationTo: 'products', admin: { description: 'Optional. Links the hero image to this product.' } },
          ],
        },
        {
          label: 'Studio intro',
          fields: [
            { name: 'introHeading', type: 'text', localized: true },
            { name: 'introStatement', type: 'textarea', localized: true },
            {
              name: 'pillars',
              type: 'array',
              maxRows: 4,
              fields: [
                { name: 'label', type: 'text', localized: true },
                { name: 'text', type: 'textarea', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Featured design',
          fields: [
            { name: 'featuredProduct', type: 'relationship', relationTo: 'products' },
            {
              name: 'detailStrip',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              maxRows: 3,
              admin: { description: 'Optional. Up to three close-ups shown under the featured design.' },
            },
          ],
        },
        {
          label: 'Closing',
          fields: [{ name: 'closingStatement', type: 'text', localized: true }],
        },
      ],
    },
  ],
}
