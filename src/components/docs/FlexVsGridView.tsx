import { getTranslations } from 'next-intl/server';
import type { DocPage } from '@/content/types';
import { ExampleBlock, Prose, Tip } from './blocks';
import styles from './blocks.module.css';

const ROWS = ['row1', 'row2', 'row3', 'row4', 'row5'];

type Props = { page: DocPage; locale: string };

export async function FlexVsGridView({ page, locale }: Props) {
  const t = await getTranslations({ locale });

  return (
    <>
      <Prose t={t} id={`${page.ns}.description`} />
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{t(`${page.ns}.feature`)}</th>
              <th scope="col">flex</th>
              <th scope="col">grid</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row}>
                <th scope="row">{t(`${page.ns}.${row}.label`)}</th>
                <td>{t(`${page.ns}.${row}.flex`)}</td>
                <td>{t(`${page.ns}.${row}.grid`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ExampleBlock t={t} id="flex-vs-grid" ns={page.ns} />
      <Tip t={t} ns={page.ns} />
    </>
  );
}
