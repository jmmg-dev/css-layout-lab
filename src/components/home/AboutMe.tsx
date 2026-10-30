import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { richTags } from '@/lib/rich';
import { AUTHOR } from '@/lib/seo';
import { LinkedInIcon, ProfileIcon } from '../icons';
import styles from './AboutMe.module.css';

// Each row is the set of brick sizes that leaves the photo showing through the wall.
const WALL = [
  { align: 'center', bricks: [1, 1, 1, 1, 1] },
  { align: 'space-between', bricks: [4, 4] },
  { align: 'space-between', bricks: [1, 3] },
  { align: 'space-between', bricks: [5, 6] },
  { align: 'center', bricks: [1, 1, 1, 1, 1] },
  { align: 'center', bricks: [2, 2, 2, 2] },
  { align: 'center', bricks: [1, 1, 1, 1, 1] },
];

export async function AboutMe({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });

  return (
    <section className={styles.about}>
      <div className={styles.text}>
        <h2>{t('home.aboutMe.title')}</h2>
        <div className={styles.description}>{t.rich('home.aboutMe.description', richTags)}</div>
      </div>
      <div className={styles.profile}>
        <div className={styles.photo}>
          <Image src="/images/photo.jpg" alt={AUTHOR} fill sizes="20rem" />
          <div className={styles.wall} aria-hidden="true">
            {WALL.map((row, index) => (
              <div key={index} style={{ justifyContent: row.align }}>
                {row.bricks.map((size, brick) => (
                  <span
                    key={brick}
                    className="brick-surface"
                    data-size={size}
                    style={{ '--order': (WALL.length - 1 - index) * 5 + brick } as CSSProperties}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className={styles.name}>{AUTHOR}</p>
        <p className={styles.role}>
          Front End Architect
          <a
            aria-label={t('ui.linkedin')}
            href="https://www.linkedin.com/in/juan-manuel-mu%C3%B1oz-gonz%C3%A1lez/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
          </a>
          <a
            aria-label={t('ui.resume')}
            href={`https://jmmg-portfolio.vercel.app/${locale}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ProfileIcon />
          </a>
        </p>
      </div>
    </section>
  );
}
