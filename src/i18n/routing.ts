import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'en',
  localePrefix: 'always',
  // hreflang tags are emitted in the document head, see lib/seo.ts.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
