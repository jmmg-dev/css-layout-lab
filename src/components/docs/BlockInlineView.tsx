import { getTranslations } from 'next-intl/server';
import { defaultElements } from '@/content/default-elements';
import type { DocPage } from '@/content/types';
import { richTags } from '@/lib/rich';
import { ExampleBlock, ItemList, Prose } from './blocks';
import styles from './blocks.module.css';

const SECTIONS = [
  { key: 'block', items: 4, example: 'block' },
  { key: 'inline', items: 5, example: 'inline' },
  { key: 'inlineBlock', items: 5, example: 'inline-block' },
] as const;

type Props = { page: DocPage; locale: string };

export async function BlockInlineView({ page, locale }: Props) {
  const t = await getTranslations({ locale });

  return (
    <>
      <Prose t={t} id={`${page.ns}.description`} />
      {SECTIONS.map(({ key, items, example }) => {
        const ns = `${page.ns}.${key}`;
        return (
          <section key={key} id={example} className={styles.fullSection}>
            <div className={styles.columns}>
              <div>
                <h2>{t.rich(`${ns}.title`, richTags)}</h2>
                <Prose t={t} id={`${ns}.description`} />
                <ItemList t={t} ns={ns} items={items} />
              </div>
              <div>
                <h3>{t.rich(`${ns}.defaultElements`, richTags)}</h3>
                <ul className={styles.badges}>
                  {defaultElements[key].map((element) => (
                    <li key={element}>
                      <code>{element}</code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <ExampleBlock t={t} id={example} ns={ns} />
          </section>
        );
      })}
    </>
  );
}
