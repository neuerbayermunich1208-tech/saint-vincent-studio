import type { CollectionConfig } from 'payload'
import { isFulfilment, isOwner } from '@/access/roles'
import { moveStock } from '@/lib/commerce/stock'

export const ORDER_STATUSES = [
  { label: 'Awaiting payment (online)', value: 'pending_payment' },
  { label: 'Awaiting bank transfer', value: 'awaiting_transfer' },
  { label: 'Confirmed (cash on delivery)', value: 'confirmed' },
  { label: 'Paid', value: 'paid' },
  { label: 'Preparing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Refunded', value: 'refunded' },
] as const

const RELEASED = ['cancelled', 'refunded']

/** Orders are only created by the checkout server action. Staff manage them here. */
export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Shop',
    defaultColumns: ['orderNumber', 'status', 'paymentMethod', 'totalVnd', 'createdAt'],
    description: 'Created by the website checkout. Change the status as the order moves; cancelling returns stock.',
  },
  access: { read: isFulfilment, create: () => false, update: isFulfilment, delete: isOwner },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (operation !== 'update' || !previousDoc) return doc
        const wasReleased = RELEASED.includes(previousDoc.status)
        const isReleased = RELEASED.includes(doc.status)
        if (!wasReleased && isReleased && doc.stockReserved) {
          await moveStock(req.payload, doc.items ?? [], 1, req)
          await req.payload.update({ collection: 'orders', id: doc.id, data: { stockReserved: false }, overrideAccess: true, req, context: { skipHooks: true } })
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'orderNumber', type: 'text', required: true, unique: true, index: true, admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        { name: 'status', type: 'select', required: true, defaultValue: 'awaiting_transfer', options: [...ORDER_STATUSES] },
        {
          name: 'paymentMethod',
          type: 'select',
          required: true,
          options: [
            { label: 'Cash on delivery', value: 'cod' },
            { label: 'Bank transfer (manual)', value: 'bank_transfer' },
            { label: 'payOS (VietQR)', value: 'payos' },
          ],
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'customer',
      type: 'group',
      fields: [
        { type: 'row', fields: [{ name: 'name', type: 'text', required: true }, { name: 'phone', type: 'text', required: true }, { name: 'email', type: 'email', required: true }] },
      ],
    },
    {
      name: 'shipping',
      type: 'group',
      fields: [
        { name: 'address', type: 'text', required: true },
        { type: 'row', fields: [{ name: 'ward', type: 'text' }, { name: 'district', type: 'text' }, { name: 'province', type: 'text', required: true }] },
        { name: 'note', type: 'textarea' },
        { name: 'trackingNumber', type: 'text', admin: { description: 'Fill in when shipped.' } },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      admin: { readOnly: true },
      fields: [
        { type: 'row', fields: [{ name: 'product', type: 'relationship', relationTo: 'products' }, { name: 'productName', type: 'text', required: true }] },
        {
          type: 'row',
          fields: [
            { name: 'sku', type: 'text', required: true },
            { name: 'variantLabel', type: 'text' },
            { name: 'unitPriceVnd', type: 'number', required: true },
            { name: 'quantity', type: 'number', required: true, min: 1 },
            { name: 'lineTotalVnd', type: 'number', required: true },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'subtotalVnd', type: 'number', required: true, admin: { readOnly: true } },
        { name: 'shippingVnd', type: 'number', admin: { readOnly: false, description: 'Empty = to be confirmed with the customer.' } },
        { name: 'totalVnd', type: 'number', required: true, admin: { readOnly: true } },
      ],
    },
    {
      name: 'payment',
      type: 'group',
      admin: { description: 'Filled in by payOS. Bank transfers and cash are confirmed by changing the status.' },
      fields: [
        { type: 'row', fields: [{ name: 'payosOrderCode', type: 'number', unique: true, index: true }, { name: 'payosPaymentLinkId', type: 'text' }] },
        { type: 'row', fields: [{ name: 'paidAt', type: 'date' }, { name: 'reference', type: 'text' }] },
        { name: 'checkoutUrl', type: 'text', admin: { readOnly: true } },
      ],
    },
    { name: 'internalNotes', type: 'textarea', admin: { description: 'Only visible to staff.' } },
    { name: 'locale', type: 'select', options: ['en', 'vi'], admin: { position: 'sidebar', readOnly: true } },
    { name: 'stockReserved', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', readOnly: true } },
    {
      name: 'accessToken',
      type: 'text',
      required: true,
      index: true,
      access: { read: () => false, update: () => false },
      admin: { hidden: true },
    },
  ],
}
