import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';

const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000');

export const SITE_NAME = 'CSS Layout Lab';
export const AUTHOR = 'Juan Manuel Muñoz González';
export const GITHUB_URL = 'https://github.com/CSS-Layout-Lab/css-layout-lab';
/** Page where people can contribute. Until it is set, the home shows the button as coming soon. */
export const DONATE_URL: string | null = null;

const OG_LOCALES: Record<Locale, string> = { es: 'es_ES', en: 'en_US' };

/** Internal link. Path is empty for the home page. */
export const localePath = (locale: string, path = '') => `/${locale}${path ? `/${path}` : ''}`;

export const absoluteUrl = (locale: string, path = '') => `${SITE_URL}${localePath(locale, path)}`;

type MetadataInput = { locale: Locale; path?: string; title: string; description: string; keywords?: string };

export function buildMetadata({ locale, path = '', title, description, keywords }: MetadataInput): Metadata {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((alternate) => [alternate, absoluteUrl(alternate, path)]),
  );
  languages['x-default'] = absoluteUrl(routing.defaultLocale, path);

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
      images: [{ url: '/images/social_media.jpg' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/images/social_media.jpg'] },
    verification: { google: 'WG9TTQ9SrU8UnFkQdWFqDpCfCVQ6iBr85tEyEc2RK4A' },
  };
}

/** Serializes JSON-LD safely: "<" cannot close the surrounding script tag. */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\u003c');
