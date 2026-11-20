import type { MetadataRoute } from 'next';
import { pages } from '@/content/pages';
import { routing } from '@/i18n/routing';
import { absoluteUrl } from '@/lib/seo';

// The sitemap is built with the site, so every deploy is the latest change.
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', ...pages.map((page) => page.path)].flatMap((path) => {
    const languages: Record<string, string> = Object.fromEntries(
      routing.locales.map((alternate) => [alternate, absoluteUrl(alternate, path)]),
    );
    languages['x-default'] = absoluteUrl(routing.defaultLocale, path);

    return routing.locales.map((locale) => ({
      url: absoluteUrl(locale, path),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: path ? 0.8 : 1,
      alternates: { languages },
    }));
  });
}
