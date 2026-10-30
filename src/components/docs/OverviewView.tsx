import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getGroupPages } from '@/content/pages';
import type { DocPage } from '@/content/types';
import { stripTags } from '@/lib/rich';
import { localePath } from '@/lib/seo';
import { Prose } from './blocks';
import styles from './blocks.module.css';

type Props = { page: DocPage; locale: string };

export async function OverviewView({ page, locale }: Props) {
  const t = await getTranslations({ locale });
  const topics = getGroupPages(page.group).filter((topic) => topic.path !== page.path);

  return (
    <>
      <Prose t={t} id={`${page.ns}.description`} />
      <p className={styles.count}>{t('ui.topics', { count: topics.length })}</p>
      <ol className={styles.topics}>
        {topics.map((topic, index) => (
          <li key={topic.path}>
            <Link href={localePath(locale, topic.path)}>
              <span aria-hidden="true">{String(index + 2).padStart(2, '0')}</span>
              {stripTags(t.raw(`${topic.ns}.title`) as string)}
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
