'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { SUPPORT_ANCHOR } from '@/lib/seo';
import styles from './AboutMe.module.css';

/** Flags when the panel is on screen, so CSS can replay its entrance every time it arrives. */
export function SupportPanel({ children }: { children: ReactNode }) {
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = panel.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        element.dataset.inView = String(entry.isIntersecting);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);

    // With the hash already in the URL a link to the panel does nothing, so go there by hand
    // and, if it was on screen and will not re-enter the view, replay the animation.
    const goToPanel = (event: MouseEvent) => {
      const link = event.target instanceof Element && event.target.closest(`a[href$="#${SUPPORT_ANCHOR}"]`);
      if (!link) return;
      element.scrollIntoView({ block: 'center' });
      if (element.dataset.inView !== 'true') return;
      element.dataset.inView = 'false';
      void element.offsetWidth;
      element.dataset.inView = 'true';
    };
    document.addEventListener('click', goToPanel);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', goToPanel);
    };
  }, []);

  return (
    <aside ref={panel} id={SUPPORT_ANCHOR} className={styles.support}>
      {children}
    </aside>
  );
}
