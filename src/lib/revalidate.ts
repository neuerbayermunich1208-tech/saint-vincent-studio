import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Content is cached for speed. Any edit in the admin refreshes the whole public site
 * (the catalogue is small, so this keeps things simple and always correct).
 */
async function refresh() {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // Outside a Next.js request (seed scripts, migrations): nothing to refresh.
  }
}

export const revalidateAll: CollectionAfterChangeHook & CollectionAfterDeleteHook = async ({ doc }) => {
  await refresh()
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc }) => {
  await refresh()
  return doc
}
