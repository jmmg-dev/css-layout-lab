import { getTranslations } from 'next-intl/server';
import type { DocPage } from '@/content/types';
import { richTags } from '@/lib/rich';
import { ExampleBlock, ItemList, Prose, Tip } from './blocks';
import styles from './blocks.module.css';

type Props = { page: DocPage; locale: string };

export async function TopicView({ page, locale }: Props) {
  const t = await getTranslations({ locale });

  return (
    <>
      {page.sections ? (
        <div className={styles.columns}>
          {page.sections.map((section) => (
            <section key={section.ns}>
              <h2>{t.rich(`${section.ns}.title`, richTags)}</h2>
              <Prose t={t} id={`${section.ns}.description`} />
              <ItemList t={t} ns={section.ns} items={section.items} />
            </section>
          ))}
        </div>
      ) : (
        <>
          <Prose t={t} id={`${page.ns}.description`} />
          <ItemList t={t} ns={page.ns} items={page.items ?? 0} />
        </>
      )}
      {page.example && <ExampleBlock t={t} id={page.example} ns={page.ns} />}
      <Tip t={t} ns={page.ns} />
    </>
  );
}
