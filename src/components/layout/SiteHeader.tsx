import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { groups, pages } from '@/content/pages';
import type { Locale } from '@/i18n/routing';
import { stripTags } from '@/lib/rich';
import { localePath } from '@/lib/seo';
import { LogoMark } from '../icons';
import { LocaleSwitcher } from './LocaleSwitcher';
import { SearchCommand, type SearchItem } from './SearchCommand';
import styles from './SiteHeader.module.css';

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });

  const searchItems: SearchItem[] = pages.map((page) => ({
    href: localePath(locale, page.path),
    label: stripTags(t.raw(`${page.ns}.title`) as string),
    group: t(`nav.${page.group}`),
  }));

  return (
    <header className={styles.header}>
      <Link className={styles.logo} href={localePath(locale)}>
        <LogoMark />
        <span>
          <span className={styles.logoCss}>CSS</span> Layout Lab
        </span>
      </Link>
      <nav className={styles.links} aria-label={t('ui.mainNav')}>
        {groups.map((group) => (
          <Link key={group.id} href={localePath(locale, group.path)}>
            {t(`nav.${group.id}`)}
          </Link>
        ))}
      </nav>
      <SearchCommand
        items={searchItems}
        label={t('ui.search')}
        placeholder={t('ui.searchPlaceholder')}
        empty={t('ui.searchEmpty')}
      />
      <LocaleSwitcher locale={locale} />
    </header>
  );
}
