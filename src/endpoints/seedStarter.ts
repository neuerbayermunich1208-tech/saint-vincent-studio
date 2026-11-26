import type { Endpoint } from 'payload'
import { hasRole, type Role } from '@/access/roles'
import { seedStarterContent } from '@/seed/content'

/**
 * POST /api/seed-starter-content — loads the starter content on a fresh deployment.
 * Owner only, and refused once any product exists so it can never overwrite real work.
 */
export const seedStarterEndpoint: Endpoint = {
  path: '/seed-starter-content',
  method: 'post',
  handler: async (req) => {
    if (!hasRole(req.user as { roles?: Role[] } | null, 'owner')) {
      return Response.json({ error: 'Owner only.' }, { status: 403 })
    }
    const existing = await req.payload.count({ collection: 'products', overrideAccess: true })
    if (existing.totalDocs > 0) {
      return Response.json({ error: 'The site already has content. Starter content was not loaded.' }, { status: 409 })
    }
    await seedStarterContent(req.payload)
    try {
      const { revalidatePath } = await import('next/cache')
      revalidatePath('/', 'layout')
    } catch {
      // revalidation is best effort outside a Next request
    }
    return Response.json({ ok: true })
  },
}
