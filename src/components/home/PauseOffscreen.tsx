'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Marks its box with data-offscreen while it is out of view, so CSS can pause
 * endless animations that nobody is watching.
 */
export function PauseOffscreen({ className, children }: { className: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      element.toggleAttribute('data-offscreen', !entry.isIntersecting);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className={className} aria-hidden="true">
      {children}
    </div>
  );
}
