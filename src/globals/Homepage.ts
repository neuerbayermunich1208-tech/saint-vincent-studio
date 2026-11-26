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
          fields: [{ name: 'featuredProduct', type: 'relationship', relationTo: 'products' }],
        },
        {
          label: 'Closing',
          fields: [{ name: 'closingStatement', type: 'text', localized: true }],
        },
      ],
    },
  ],
}
