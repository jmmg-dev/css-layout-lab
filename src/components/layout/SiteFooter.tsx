import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { groups } from '@/content/pages';
import type { Locale } from '@/i18n/routing';
import { GITHUB_URL, LINKEDIN_URL, localePath } from '@/lib/seo';
import { GitHubIcon, LinkedInIcon, LogoMark } from '../icons';
import styles from './SiteFooter.module.css';

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'ui' });
  const nav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <footer className={styles.footer}>
      <div className={styles.start}>
        <div className={styles.identity}>
          <Link className={styles.brand} href={localePath(locale)}>
            <span>
              <span className={styles.brandCss}>CSS</span> Layout Lab
            </span>
          </Link>
          <p className={styles.tagline}>
            {t.rich('footerTagline', {
              heart: () => (
                <span className={styles.heart} role="img" aria-label={t('love')}>
                  ♥
                </span>
              ),
            })}
          </p>
          <p className={styles.copyright}>© 2026 JMMG.dev</p>
        </div>
      </div>
      <nav className={styles.sections} aria-labelledby="footer-sections">
        <h2 id="footer-sections" className={styles.heading}>
          {t('footerSections')}
        </h2>
        <div className={styles.sectionLinks}>
          {groups.map((group) => (
            <Link key={group.id} href={localePath(locale, group.path)}>
              {nav(group.id)}
            </Link>
          ))}
        </div>
      </nav>
      <div className={styles.end}>
        <ul className={styles.socials} aria-label={t('footerLinks')}>
          <li>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label={t('linkedin')}>
              <LinkedInIcon />
              LinkedIn
            </a>
          </li>
          <li>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label={t('github')}>
              <GitHubIcon />
              GitHub
            </a>
          </li>
        </ul>
        <div className={styles.signature}>
          <LogoMark size={28} />
          <a
            className={styles.poweredby}
            href="https://jmmg.dev"
            target="_blank"
            rel="noopener"
            aria-label="Powered by JMMG.dev"
          >
            <span aria-hidden="true">Powered by</span>
            {/* Both logos are in the page; the theme decides which one is shown. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- small static SVG, nothing to optimise */}
            <img className={styles.poweredbyLight} src="/brand/jmmg-dev-light-bg.svg" alt="" width={80} height={15} />
            {/* eslint-disable-next-line @next/next/no-img-element -- small static SVG, nothing to optimise */}
            <img className={styles.poweredbyDark} src="/brand/jmmg-dev-dark-bg.svg" alt="" width={80} height={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}
