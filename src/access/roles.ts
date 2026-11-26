import type { Access, FieldAccess, PayloadRequest } from 'payload'

export const ROLES = ['owner', 'editor', 'fulfilment'] as const
export type Role = (typeof ROLES)[number]

type MaybeUser = { roles?: Role[] | null } | null | undefined

export const hasRole = (user: MaybeUser, ...roles: Role[]): boolean =>
  Boolean(user?.roles?.some((r) => roles.includes(r)))

const userOf = (req: PayloadRequest) => req.user as MaybeUser

/** Anyone signed in to the admin. */
export const isStaff: Access = ({ req }) => Boolean(req.user)
/** Owners only: users, roles, site mode. */
export const isOwner: Access = ({ req }) => hasRole(userOf(req), 'owner')
/** Content and catalogue editing. */
export const isEditor: Access = ({ req }) => hasRole(userOf(req), 'owner', 'editor')
/** Orders, inventory, customer data. */
export const isFulfilment: Access = ({ req }) => hasRole(userOf(req), 'owner', 'fulfilment')

export const isOwnerField: FieldAccess = ({ req }) => hasRole(userOf(req), 'owner')

/**
 * Public read for published documents only. Staff can read drafts.
 * Works for collections with `versions.drafts` enabled.
 */
export const publishedOrStaff: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

/** Public read for documents marked visible. */
export const visibleOrStaff: Access = ({ req }) => {
  if (req.user) return true
  return { visible: { equals: true } }
}
