'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import styles from './SiteHeader.module.css';

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
          >
            {target}
          </Link>
        </li>
      ))}
    </ul>
  );
}
