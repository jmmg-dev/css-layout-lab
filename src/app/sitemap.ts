import type { MetadataRoute } from 'next';
import { pages } from '@/content/pages';
import { routing } from '@/i18n/routing';
import { absoluteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', ...pages.map((page) => page.path)].flatMap((path) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(locale, path),
      changeFrequency: 'monthly' as const,
      priority: path ? 0.8 : 1,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((alternate) => [alternate, absoluteUrl(alternate, path)])),
      },
    })),
  );
}
