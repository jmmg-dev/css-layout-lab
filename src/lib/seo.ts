import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';

/** Canonical domain. www.css-layout-lab.com redirects here, configured in Vercel. */
const PRODUCTION_URL = 'https://css-layout-lab.com';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === 'production' ? PRODUCTION_URL : 'http://localhost:3000');

export const SITE_NAME = 'CSS Layout Lab';
export const AUTHOR = 'Juan Manuel Muñoz González';
export const AUTHOR_URL = 'https://jmmg.dev';
export const GITHUB_URL = 'https://github.com/jmmg-dev/css-layout-lab';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/juan-manuel-mu%C3%B1oz-gonz%C3%A1lez/';
/**
 * Ways to support the projects, shown as buttons in the support panel, the first one filled.
 * Adding a method is one entry here, its label in messages (home.support.methods.<id>)
 * and its icon in SupportMethodIcon (components/home/SupportSection.tsx).
 */
export const SUPPORT_METHODS = [{ id: 'kofi', name: 'Ko-fi', url: 'https://ko-fi.com/jmmgdev' }] as const;
/** Anchor of the contribution panel on the home page. */
export const SUPPORT_ANCHOR = 'support';

const OG_LOCALES: Record<Locale, string> = { es: 'es_ES', en: 'en_US' };

/** Internal link. Path is empty for the home page. */
export const localePath = (locale: string, path = '') => `/${locale}${path ? `/${path}` : ''}`;

export const absoluteUrl = (locale: string, path = '') => `${SITE_URL}${localePath(locale, path)}`;

/** Social card for each language, served by app/[locale]/og-image.png. */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
const ogImage = (locale: string) => `/${locale}/og-image.png`;

type MetadataInput = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  keywords?: string;
  /** Alt text of the social card, in the page language. */
  imageAlt: string;
};

export function buildMetadata({ locale, path = '', title, description, keywords, imageAlt }: MetadataInput): Metadata {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((alternate) => [alternate, absoluteUrl(alternate, path)]),
  );
  languages['x-default'] = absoluteUrl(routing.defaultLocale, path);
  const image = { url: ogImage(locale), ...OG_IMAGE_SIZE, alt: imageAlt };

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    keywords,
    authors: [{ name: AUTHOR }],
    alternates: { canonical: absoluteUrl(locale, path), languages },
    openGraph: {
      type: path ? 'article' : 'website',
      title,
      description,
      siteName: SITE_NAME,
      url: absoluteUrl(locale, path),
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales.filter((other) => other !== locale).map((other) => OG_LOCALES[other]),
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

/** Serializes JSON-LD safely: "<" cannot close the surrounding script tag. */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\u003c');
