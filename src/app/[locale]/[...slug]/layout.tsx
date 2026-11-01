import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { SideNav, type NavGroup } from '@/components/layout/SideNav';
import { getGroupPages, groups } from '@/content/pages';
import { stripTags } from '@/lib/rich';
import { localePath, SUPPORT_ANCHOR } from '@/lib/seo';
import styles from './docs.module.css';

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export default async function DocsLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const navGroups: NavGroup[] = groups.map((group) => ({
    id: group.id,
    label: t(`nav.${group.id}`),
    links: getGroupPages(group.id).map((page, index) => ({
      href: localePath(locale, page.path),
      number: String(index + 1).padStart(2, '0'),
      label: stripTags(t.raw(`${page.ns}.title`) as string),
    })),
  }));

  return (
    <div className={styles.shell}>
      <SideNav
        groups={navGroups}
        label={t('ui.mainNav')}
        openLabel={t('ui.openMenu')}
        closeLabel={t('ui.closeMenu')}
        support={{ href: `${localePath(locale)}#${SUPPORT_ANCHOR}`, label: t('home.support.title') }}
      />
      <main id="content" className={styles.main}>
        {children}
      </main>
    </div>
  );
}
