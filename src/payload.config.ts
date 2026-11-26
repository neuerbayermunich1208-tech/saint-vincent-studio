import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Orders } from './collections/Orders'
import { seedStarterEndpoint } from './endpoints/seedStarter'
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

// Origins allowed to use the admin cookie: the configured site URL plus Vercel's production, branch and deployment URLs.
const allowedOrigins = [
  process.env.NEXT_PUBLIC_SITE_URL,
  ...[process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_BRANCH_URL, process.env.VERCEL_URL]
    .filter(Boolean)
    .map((host) => `https://${host}`),
].filter((origin): origin is string => Boolean(origin)).map((origin) => origin.replace(/\/$/, ''))

const dirname = path.dirname(fileURLToPath(import.meta.url))

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET is not set. Copy .env.example to .env and fill it in.')
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  csrf: allowedOrigins,
  cors: allowedOrigins,
  secret: process.env.PAYLOAD_SECRET,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · Saint Vincent Studio' },
    importMap: { baseDir: path.resolve(dirname) },
    components: { beforeDashboard: ['/admin/SeedStarterButton'] },
  },
  endpoints: [seedStarterEndpoint],
  collections: [Products, ProductCollections, Releases, JournalPosts, Pages, Media, Subscribers, Inquiries, Orders, Users],
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
    pool: { connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL },
    // Schema is pushed automatically in development. Production runs `npm run migrate` before `next build` (see ARCHITECTURE.md).
    push: process.env.NODE_ENV !== 'production',
  }),
  sharp,
  plugins: [
    // On Vercel the filesystem is not persistent, so media goes to Vercel Blob when a token is set.
    // Locally (no token) uploads stay in ./media. clientUploads bypasses the 4.5 MB serverless body limit.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // Keep the media schema identical with or without a token, so migrations match every environment.
      alwaysInsertFields: true,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true,
    }),
  ],
  graphQL: { disable: true },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  upload: { limits: { fileSize: 25_000_000 } },
})
