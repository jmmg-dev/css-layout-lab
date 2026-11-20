'use client';

import { useEffect, useRef } from 'react';

// Width ÷ height of the heart outline (its viewBox).
const RATIO = 20.8 / 18.1;
const MAX_SHARE = 0.3;
// The heart is a little smaller than the text, which gives it room to breathe.
const SCALE = 0.85;

/**
 * A heart exactly as tall as the text next to it. CSS cannot do this
 * alone: the heart's width narrows the text, which changes its height. Measuring settles it in
 * a step or two, and the heart only shows once it has its size, so it never jumps.
 */
export function FitHeart({ className }: { className: string }) {
  const box = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const heart = box.current;
    const text = heart?.nextElementSibling;
    if (!heart || !text) return;

    // On narrow screens the text runs to many lines: the heart stops at a share of the row
    // and sits at the top of the text instead of growing wider than the panel.
    const row = heart.parentElement ?? text;
    const fit = () => {
      const tall = text.getBoundingClientRect().height * RATIO;
      const width = Math.round(Math.min(tall, row.clientWidth * MAX_SHARE) * SCALE);
      if (Math.abs(heart.offsetWidth - width) > 1) heart.style.width = `${width}px`;
      heart.dataset.ready = '';
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(text);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={box} className={className}>
      <svg aria-hidden="true" viewBox="1.6 3.9 20.8 18.1" preserveAspectRatio="xMidYMin meet">
        <path
          fill="currentColor"
          d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"
        />
      </svg>
    </span>
  );
}
