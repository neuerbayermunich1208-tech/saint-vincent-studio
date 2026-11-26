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
    { name: 'defaultCurrency', type: 'select', defaultValue: 'VND', options: ['VND', 'USD'] },
  ],
}
