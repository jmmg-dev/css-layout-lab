import { getTranslations } from 'next-intl/server';
import { getGroupPages, groups } from '@/content/pages';
import { stripTags } from '@/lib/rich';
import { localePath, SUPPORT_ANCHOR } from '@/lib/seo';
import { SideNav, type NavGroup } from './SideNav';

type Props = {
  locale: string;
  /** Only the collapsible version, for pages without a side column such as the home. */
  compact?: boolean;
};

export async function SiteMenu({ locale, compact = false }: Props) {
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
    <SideNav
      groups={navGroups}
      label={t('ui.mainNav')}
      openLabel={t('ui.openMenu')}
      closeLabel={t('ui.closeMenu')}
      support={{ href: `${localePath(locale)}#${SUPPORT_ANCHOR}`, label: t('home.support.title') }}
      compact={compact}
    />
  );
}
