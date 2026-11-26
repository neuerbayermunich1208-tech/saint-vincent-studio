import type { CollectionConfig } from 'payload'
import { isEditor } from '@/access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content', description: 'Images and video. Alt text is required in every language.' },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm', 'application/pdf'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 480 },
      { name: 'card', width: 960 },
      { name: 'hero', width: 1920 },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', required: true, localized: true, admin: { description: 'Describe what is in the image.' } },
    { name: 'caption', type: 'text', localized: true },
    {
      name: 'isConcept',
      type: 'checkbox',
      defaultValue: false,
      label: 'Concept image (not the final product)',
      admin: { description: 'Shows a “Concept” label on the website.' },
    },
  ],
}
