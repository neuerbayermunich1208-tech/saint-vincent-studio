import type { GlobalConfig } from 'payload'
import { isOwner } from '@/access/roles'
import { revalidateGlobal } from '@/lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: { read: () => true, update: isOwner },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'mode',
      type: 'radio',
      required: true,
      defaultValue: 'prelaunch',
      options: [
        { label: 'Pre-launch: show the brand and concepts, collect sign-ups, no buying', value: 'prelaunch' },
        { label: 'Commerce: show prices, cart and checkout (requires payments to be set up)', value: 'commerce' },
      ],
      admin: { description: 'Commerce mode only takes effect once a payment provider has been configured and tested.' },
    },
    {
      name: 'features',
      type: 'group',
      label: 'Feature switches',
      admin: { description: 'Switched-off pages are hidden from navigation, the sitemap and search engines.' },
      fields: [
        { name: 'journal', type: 'checkbox', defaultValue: false, label: 'Design Journal (switch on once there are at least 3 posts)' },
        { name: 'shop', type: 'checkbox', defaultValue: false, label: 'Shop page (all products with filters)' },
        { name: 'search', type: 'checkbox', defaultValue: false },
        { name: 'wishlist', type: 'checkbox', defaultValue: true },
        { name: 'modularPreview', type: 'checkbox', defaultValue: true, label: 'Modular Universe section on the home page' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'email', defaultValue: 'hello@saintvincent.studio' },
        { name: 'instagram', type: 'text', admin: { description: 'Full URL' } },
        { name: 'tiktok', type: 'text', admin: { description: 'Full URL' } },
        { name: 'facebook', type: 'text', admin: { description: 'Full URL' } },
      ],
    },
    {
      name: 'checkout',
      type: 'group',
      label: 'Checkout',
      admin: { description: 'Only used in commerce mode. Switch on only the methods that are really set up.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'payos', type: 'checkbox', defaultValue: false, label: 'payOS (VietQR) — needs PAYOS_* keys on the server' },
            { name: 'bankTransfer', type: 'checkbox', defaultValue: false, label: 'Manual bank transfer' },
            { name: 'cod', type: 'checkbox', defaultValue: false, label: 'Cash on delivery' },
          ],
        },
        {
          name: 'bank',
          type: 'group',
          label: 'Bank account for manual transfers',
          admin: { condition: (data) => Boolean(data?.checkout?.bankTransfer) },
          fields: [{ type: 'row', fields: [{ name: 'bankName', type: 'text' }, { name: 'accountName', type: 'text' }, { name: 'accountNumber', type: 'text' }] }],
        },
        {
          type: 'row',
          fields: [
            { name: 'shippingFlatVnd', type: 'number', min: 0, label: 'Shipping fee (VND)', admin: { description: 'Empty = confirmed with each customer.' } },
            { name: 'freeShippingOverVnd', type: 'number', min: 0, label: 'Free shipping from (VND)', admin: { description: 'Optional.' } },
          ],
        },
      ],
    },
    { name: 'defaultCurrency', type: 'select', defaultValue: 'VND', options: ['VND', 'USD'] },
  ],
}
