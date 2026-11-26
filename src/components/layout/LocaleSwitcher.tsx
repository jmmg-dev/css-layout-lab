'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import styles from './SiteHeader.module.css';

/**
 * Stores the chosen language as next-intl does (its default locale cookie). The middleware only
 * updates that cookie on full page loads, and these links navigate on the client, so without
 * this the site root would keep opening in the previous language.
 */
const rememberLocale = (locale: Locale) => {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; samesite=lax`;
};

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <ul className={styles.locales}>
      {routing.locales.map((target) => (
        <li key={target}>
          <Link
            href={pathname.replace(/^\/[^/]+/, `/${target}`)}
            hrefLang={target}
            lang={target}
            aria-current={target === locale ? 'true' : undefined}
            onClick={() => rememberLocale(target)}
          >
            {target}
          </Link>
        </li>
      ))}
    </ul>
  );
}
