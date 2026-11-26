import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { ProductCollections } from './collections/ProductCollections'
import { Releases } from './collections/Releases'
import { JournalPosts } from './collections/JournalPosts'
import { Pages } from './collections/Pages'
import { Subscribers } from './collections/Subscribers'
import { Inquiries } from './collections/Inquiries'
import { SiteSettings } from './globals/SiteSettings'
import { Homepage } from './globals/Homepage'

const dirname = path.dirname(fileURLToPath(import.meta.url))

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET is not set. Copy .env.example to .env and fill it in.')
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  secret: process.env.PAYLOAD_SECRET,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · Saint Vincent Studio' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Products, ProductCollections, Releases, JournalPosts, Pages, Media, Subscribers, Inquiries, Users],
  globals: [Homepage, SiteSettings],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Tiếng Việt', code: 'vi' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    // Schema is pushed automatically in development. Production runs `npm run migrate` before `next build` (see ARCHITECTURE.md).
    push: process.env.NODE_ENV !== 'production',
  }),
  sharp,
  graphQL: { disable: true },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  upload: { limits: { fileSize: 25_000_000 } },
})
