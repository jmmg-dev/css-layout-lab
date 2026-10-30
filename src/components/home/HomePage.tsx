import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { ExampleBlock } from '@/components/docs/blocks';
import { groups, pages } from '@/content/pages';
import { richTags } from '@/lib/rich';
import { absoluteUrl, AUTHOR, localePath, serializeJsonLd, SITE_NAME } from '@/lib/seo';
import { ArrowRightIcon } from '../icons';
import { AboutMe } from './AboutMe';
import styles from './HomePage.module.css';

export async function HomePage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: absoluteUrl(locale),
    inLanguage: locale,
    description: t('meta.description'),
    author: { '@type': 'Person', name: AUTHOR },
  };

  return (
    <main id="content" className={styles.home}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>
            <span className={styles.css}>CSS</span>
            <span className={styles.lab}>Layout Lab</span>
          </h1>
          <Link className="button" href={localePath(locale, 'introduction')}>
            {t('home.getStarted')}
            <ArrowRightIcon />
          </Link>
        </div>
        <div className={styles.heroPlate}>
          <Image
            src="/images/cssLayoutLabReal.webp"
            alt="CSS Layout Lab"
            width={786}
            height={422}
            priority
            sizes="(max-width: 800px) 100vw, 45vw"
          />
        </div>
        <p className={styles.introLead}>{t.rich('home.introduction', richTags)}</p>
        <p className={styles.introBody}>{t.rich('home.description', richTags)}</p>
      </section>

      <section className={styles.map}>
        <h2>{t('home.map.title')}</h2>
        <ul>
          {groups.map((group, index) => {
            const count = pages.filter((page) => page.group === group.id).length;
            return (
              <li key={group.id} data-group={group.id}>
                <Link href={localePath(locale, group.path)}>
                  <span className={styles.mapIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.mapDiagram} aria-hidden="true">
                    {Array.from({ length: 6 }, (_, cell) => (
                      <i key={cell} />
                    ))}
                  </span>
                  <h3>{t(`nav.${group.id}`)}</h3>
                  <p>{t(`home.map.${group.id}`)}</p>
                  <span className={styles.mapCount}>{t('ui.topics', { count })}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.brick}>
        <div>
          <h2>{t('home.example.title')}</h2>
          <p>{t.rich('home.example.description', richTags)}</p>
        </div>
        <ExampleBlock t={t} id="brick" heading={false} />
      </section>

      <AboutMe locale={locale} />
    </main>
  );
}
