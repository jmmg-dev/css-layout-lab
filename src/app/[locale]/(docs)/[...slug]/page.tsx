import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { BlockInlineView } from '@/components/docs/BlockInlineView';
import { DocFrame } from '@/components/docs/DocFrame';
import { FlexVsGridView } from '@/components/docs/FlexVsGridView';
import { IntroductionView } from '@/components/docs/IntroductionView';
import { OverviewView } from '@/components/docs/OverviewView';
import { TopicView } from '@/components/docs/TopicView';
import { getPage, pages } from '@/content/pages';
import type { DocPage } from '@/content/types';
import { routing } from '@/i18n/routing';
import { stripTags, truncate } from '@/lib/rich';
import { buildMetadata, SITE_NAME } from '@/lib/seo';

type Props = { params: Promise<{ locale: string; slug: string[] }> };

export function generateStaticParams() {
  return pages.map((page) => ({ slug: page.path.split('/') }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const page = getPage(slug.join('/'));
  if (!hasLocale(routing.locales, locale)) return {};
  // Only the root not-found can set its own title, so the 404 of each language gets it here.
  if (!page) {
    const t = await getTranslations({ locale, namespace: 'ui' });
    return { title: { absolute: `${t('notFoundMeta')} | ${SITE_NAME}` } };
  }

  const t = await getTranslations({ locale });
  // A page can set its own SEO title and description when the visible ones are too short or vague.
  const title = stripTags(t.raw(t.has(`${page.ns}.metaTitle`) ? `${page.ns}.metaTitle` : `${page.ns}.title`) as string);
  const descriptionKey = [`${page.ns}.metaDescription`, `${page.ns}.description`, `${page.ns}.example`].find((key) =>
    t.has(key),
  )!;
  return buildMetadata({
    locale,
    path: page.path,
    title: pageTitle(title, t),
    description: truncate(stripTags(t.raw(descriptionKey) as string)),
    imageAlt: t('meta.imageAlt'),
  });
}

/** Keeps titles within the 30–60 characters that search results show in full. */
function pageTitle(title: string, t: Awaited<ReturnType<typeof getTranslations>>) {
  // Titles that already name CSS would read twice in the template.
  if (/css/i.test(title)) return `${title} | ${SITE_NAME}`;
  const full = t('meta.pageTitle', { title });
  if (full.length > 60) return t('meta.pageTitleShort', { title });
  if (full.length < 30) return t('meta.pageTitleLong', { title });
  return full;
}

function renderView(page: DocPage, locale: string) {
  switch (page.view) {
    case 'overview':
      return <OverviewView page={page} locale={locale} />;
    case 'introduction':
      return <IntroductionView page={page} locale={locale} />;
    case 'blockInline':
      return <BlockInlineView page={page} locale={locale} />;
    case 'flexVsGrid':
      return <FlexVsGridView page={page} locale={locale} />;
    default:
      return <TopicView page={page} locale={locale} />;
  }
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  const page = getPage(slug.join('/'));
  if (!page || !hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <DocFrame page={page} locale={locale}>
      {renderView(page, locale)}
    </DocFrame>
  );
}
