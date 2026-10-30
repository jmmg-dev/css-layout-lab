import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { groups } from '@/content/pages';
import type { Locale } from '@/i18n/routing';
import { localePath } from '@/lib/seo';
import { LogoMark } from '../icons';
import { LocaleSwitcher } from './LocaleSwitcher';
import styles from './SiteHeader.module.css';

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });

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
      <LocaleSwitcher locale={locale} />
    </header>
  );
}
