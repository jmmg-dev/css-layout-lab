import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { getPageNumber, getSiblings, groups } from '@/content/pages';
import type { DocPage } from '@/content/types';
import { richTags, stripTags } from '@/lib/rich';
import { absoluteUrl, AUTHOR, localePath, serializeJsonLd, SITE_NAME } from '@/lib/seo';
import { ArrowLeftIcon, ArrowRightIcon } from '../icons';
import styles from './DocFrame.module.css';

type Props = { page: DocPage; locale: string; children: ReactNode };

export async function DocFrame({ page, locale, children }: Props) {
  const t = await getTranslations({ locale });
  const { previous, next } = getSiblings(page.path);
  const titleOf = (target: DocPage) => stripTags(t.raw(`${target.ns}.title`) as string);
  const title = titleOf(page);
  const group = groups.find((item) => item.id === page.group)!;
  const groupLabel = t(`nav.${page.group}`);
  const number = String(getPageNumber(page)).padStart(2, '0');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: title,
        inLanguage: locale,
        url: absoluteUrl(locale, page.path),
        author: { '@type': 'Person', name: AUTHOR },
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: absoluteUrl(locale) },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { name: t('ui.home'), url: absoluteUrl(locale) },
          { name: groupLabel, url: absoluteUrl(locale, group.path) },
          { name: title, url: absoluteUrl(locale, page.path) },
        ].map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })),
      },
    ],
  };

  return (
    <article className={styles.article}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <header className={styles.header}>
        <nav aria-label={t('ui.breadcrumb')}>
          <ol className={styles.breadcrumb}>
            <li>
              <Link href={localePath(locale)}>{t('ui.home')}</Link>
            </li>
            <li>
              <Link href={localePath(locale, group.path)}>{groupLabel}</Link>
            </li>
            <li aria-current="page">{title}</li>
          </ol>
        </nav>
        <span className={styles.number} aria-hidden="true">
          {number}
        </span>
        <h1>{t.rich(`${page.ns}.title`, richTags)}</h1>
      </header>

      {children}

      <nav className={styles.pagination} aria-label={t('ui.pagination')}>
        {previous && (
          <Link href={localePath(locale, previous.path)} rel="prev">
            <span>
              <ArrowLeftIcon /> {t('ui.previous')}
            </span>
            {titleOf(previous)}
          </Link>
        )}
        {next && (
          <Link className={styles.nextLink} href={localePath(locale, next.path)} rel="next">
            <span>
              {t('ui.next')} <ArrowRightIcon />
            </span>
            {titleOf(next)}
          </Link>
        )}
      </nav>
    </article>
  );
}
