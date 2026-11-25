import { afterEach, describe, expect, it, vi } from 'vitest';
import { absoluteUrl, buildMetadata, localePath, serializeJsonLd, SITE_URL } from './seo';

const input = { locale: 'es' as const, title: 'Título', description: 'Descripción', imageAlt: 'Alt' };

describe('localePath and absoluteUrl', () => {
  it('builds the home path of a language', () => {
    expect(localePath('es')).toBe('/es');
  });

  it('builds a page path inside a language', () => {
    expect(localePath('en', 'flex/flex-wrap')).toBe('/en/flex/flex-wrap');
  });

  it('prefixes the site URL', () => {
    expect(absoluteUrl('es', 'grid')).toBe(`${SITE_URL}/es/grid`);
  });
});

describe('buildMetadata', () => {
  it('points the canonical URL to the page itself', () => {
    const metadata = buildMetadata({ ...input, path: 'grid' });
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/es/grid`);
  });

  it('links every language and x-default to the English version', () => {
    const languages = buildMetadata({ ...input, path: 'grid' }).alternates?.languages;
    expect(languages).toEqual({
      es: `${SITE_URL}/es/grid`,
      en: `${SITE_URL}/en/grid`,
      'x-default': `${SITE_URL}/en/grid`,
    });
  });

  it('describes the home page as a website and the rest as articles', () => {
    expect(buildMetadata(input).openGraph).toMatchObject({ type: 'website' });
    expect(buildMetadata({ ...input, path: 'grid' }).openGraph).toMatchObject({ type: 'article' });
  });

  it('gives Open Graph the page locale and the other one as alternate', () => {
    expect(buildMetadata(input).openGraph).toMatchObject({ locale: 'es_ES', alternateLocale: ['en_US'] });
    expect(buildMetadata({ ...input, locale: 'en' }).openGraph).toMatchObject({
      locale: 'en_US',
      alternateLocale: ['es_ES'],
    });
  });

  it('uses the social card of the page language, with its size and alt text', () => {
    const image = { url: '/es/og-image.png', width: 1200, height: 630, alt: 'Alt' };
    const metadata = buildMetadata(input);
    expect(metadata.openGraph?.images).toEqual([image]);
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image', images: [image] });
  });

  it('keeps the title as is, without a template', () => {
    expect(buildMetadata(input).title).toEqual({ absolute: 'Título' });
  });
});

describe('serializeJsonLd', () => {
  it('serialises the data as JSON', () => {
    expect(JSON.parse(serializeJsonLd({ name: 'CSS Layout Lab' }))).toEqual({ name: 'CSS Layout Lab' });
  });
});

describe('SITE_URL', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('uses NEXT_PUBLIC_SITE_URL when it is set', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://preview.example');
    vi.resetModules();
    expect((await import('./seo')).SITE_URL).toBe('https://preview.example');
  });

  it('uses the production domain in production', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', undefined);
    vi.stubEnv('NODE_ENV', 'production');
    vi.resetModules();
    expect((await import('./seo')).SITE_URL).toBe('https://css-layout-lab.com');
  });

  it('uses localhost in development', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', undefined);
    vi.stubEnv('NODE_ENV', 'development');
    vi.resetModules();
    expect((await import('./seo')).SITE_URL).toBe('http://localhost:3000');
  });
});
