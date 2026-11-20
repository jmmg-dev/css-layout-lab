import { getTranslations } from 'next-intl/server';
import { SUPPORT_METHODS } from '@/lib/seo';
import { CoffeeIcon } from '../icons';
import { FitHeart } from './FitHeart';
import styles from './SupportSection.module.css';
import { SupportPanel } from './SupportPanel';

const SupportMethodIcon = ({ id }: { id: (typeof SUPPORT_METHODS)[number]['id'] }) => {
  switch (id) {
    case 'kofi':
      return <CoffeeIcon />;
  }
};

export async function SupportSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.support' });

  return (
    <SupportPanel>
      <div className={styles.supportText}>
        <FitHeart className={styles.supportHeart} />
        <div>
          <h2>{t('title')}</h2>
          <p>{t('description')}</p>
          <p className={styles.supportThanks}>{t('thanks')}</p>
        </div>
      </div>
      <div className={styles.supportMethods}>
        {SUPPORT_METHODS.map((method, index) => (
          <a
            key={method.id}
            className={index === 0 ? 'button' : `button ${styles.supportSecondary}`}
            href={method.url}
            target="_blank"
            rel="noopener"
          >
            <SupportMethodIcon id={method.id} />
            {t(`methods.${method.id}`)}
          </a>
        ))}
      </div>
    </SupportPanel>
  );
}
