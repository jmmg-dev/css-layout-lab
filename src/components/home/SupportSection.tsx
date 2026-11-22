import { getTranslations } from 'next-intl/server';
import { SUPPORT_METHODS } from '@/lib/seo';
import { CoffeeIcon } from '../icons';
import styles from './SupportSection.module.css';
import { SupportPanel } from './SupportPanel';

const SupportMethodIcon = ({ id }: { id: (typeof SUPPORT_METHODS)[number]['id'] }) => {
  switch (id) {
    case 'kofi':
      return <CoffeeIcon />;
  }
};

/** Filled heart cropped to its outline, so the beat scales from its centre. */
const Heart = () => (
  <svg className={styles.supportHeart} aria-hidden="true" viewBox="1.6 3.9 20.8 18.1" fill="currentColor">
    <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
  </svg>
);

export async function SupportSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.support' });

  return (
    <SupportPanel>
      <Heart />
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>
      <p className={styles.supportThanks}>{t('thanks')}</p>
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
