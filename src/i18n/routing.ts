import { defineRouting } from 'next-intl/routing'

export const locales = ['en', 'vi'] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
  // Remembers the visitor's choice in a cookie.
  localeCookie: { name: 'SV_LOCALE', maxAge: 60 * 60 * 24 * 365 },
})
