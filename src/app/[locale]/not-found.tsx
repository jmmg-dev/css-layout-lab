import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeftIcon } from '@/components/icons';
import { localePath } from '@/lib/seo';

export default function NotFound() {
  const t = useTranslations('ui');
  const locale = useLocale();

  return (
    <main id="content" className="not-found">
      <p className="not-found-code" aria-hidden="true">
        404
      </p>
      <h1>{t('notFoundTitle')}</h1>
      <p>{t('notFoundText')}</p>
      <Link className="button" href={localePath(locale)}>
        <ArrowLeftIcon />
        {t('backHome')}
      </Link>
    </main>
  );
}
