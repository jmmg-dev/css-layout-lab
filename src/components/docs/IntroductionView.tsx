import { getTranslations } from 'next-intl/server';
import type { DocPage } from '@/content/types';
import { richTags } from '@/lib/rich';
import { ItemList, Prose } from './blocks';
import styles from './blocks.module.css';
import { BoxDiagram, ContainerDiagram } from './diagrams';

type Props = { page: DocPage; locale: string };

export async function IntroductionView({ page, locale }: Props) {
  const t = await getTranslations({ locale });
  const concept = (key: string, items: number) => {
    const ns = `${page.ns}.${key}`;
    return (
      <>
        <h2>{t.rich(`${ns}.title`, richTags)}</h2>
        <Prose t={t} id={`${ns}.description`} />
        {items > 0 && <ItemList t={t} ns={ns} items={items} />}
      </>
    );
  };

  return (
    <>
      <Prose t={t} id={`${page.ns}.description`} />
      <div className={styles.columns}>
        <section>{concept('boxModel', 4)}</section>
        <BoxDiagram />
        <section>{concept('display', 4)}</section>
        <section>{concept('axis', 3)}</section>
        <section>{concept('containers', 2)}</section>
        <ContainerDiagram container={t('container')} child={t('child')} />
        <section>{concept('gap', 4)}</section>
        <section>{concept('responsive', 0)}</section>
      </div>
      <section className={styles.fullSection}>
        {concept('units', 0)}
        <div className={styles.columns}>
          <section>{concept('units.absolutes', 5)}</section>
          <section>{concept('units.relatives', 10)}</section>
        </div>
      </section>
    </>
  );
}
