import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import styles from './SiteHeader.module.css';

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'ui' });

  return (
    <footer className={styles.footer}>
      <span>JMMG - CSS Layout Lab - {new Date().getFullYear()} &reg;</span>
      <span>{t('footerCaption')}</span>
    </footer>
  );
}
