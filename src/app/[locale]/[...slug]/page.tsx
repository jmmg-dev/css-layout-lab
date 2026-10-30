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
  if (!page || !hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale });
  const title = stripTags(t.raw(`${page.ns}.title`) as string);
  const descriptionKey = t.has(`${page.ns}.description`) ? `${page.ns}.description` : `${page.ns}.example`;
  return buildMetadata({
    locale,
    path: page.path,
    // Titles that already name CSS would read twice in the template.
    title: /css/i.test(title) ? `${title} | ${SITE_NAME}` : t('meta.pageTitle', { title }),
    description: truncate(stripTags(t.raw(descriptionKey) as string)),
  });
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
