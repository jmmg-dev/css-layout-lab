import { setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { SiteMenu } from '@/components/layout/SiteMenu';
import styles from './docs.module.css';

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export default async function DocsLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className={styles.shell}>
      <SiteMenu locale={locale} />
      <main id="content" className={styles.main}>
        {children}
      </main>
    </div>
  );
}
