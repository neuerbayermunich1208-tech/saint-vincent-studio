import type { CollectionConfig } from 'payload'
import { ROLES, hasRole, isOwner, isOwnerField } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Admin user', plural: 'Admin users' },
  admin: { useAsTitle: 'email', group: 'Settings', defaultColumns: ['name', 'email', 'roles'] },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
  },
  access: {
    read: ({ req }) => (req.user ? (hasRole(req.user as never, 'owner') ? true : { id: { equals: req.user.id } }) : false),
    create: isOwner,
    update: ({ req }) => (req.user ? (hasRole(req.user as never, 'owner') ? true : { id: { equals: req.user.id } }) : false),
    delete: isOwner,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: ROLES.map((r) => ({ label: r[0].toUpperCase() + r.slice(1), value: r })),
      access: { update: isOwnerField, create: isOwnerField },
      saveToJWT: true,
      admin: { description: 'Owner: everything. Editor: content and catalogue. Fulfilment: orders and stock.' },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // The very first account becomes the owner so the site can never be locked out.
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
          if (totalDocs === 0) data.roles = ['owner']
        }
        return data
      },
    ],
  },
}
