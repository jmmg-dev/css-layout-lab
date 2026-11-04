'use client';

import { useEffect, useRef, useState } from 'react';
import { USER_STYLE_ID } from '@/lib/preview-doc';
import styles from './Playground.module.css';

const MAX_HEIGHT = 640;

type Props = {
  html: string;
  css: string;
  /** Built once on the server, so the example is complete before any JavaScript runs. */
  initialDoc: string;
  minHeight: number;
  title: string;
};

export function Preview({ html, css, initialDoc, minHeight, title }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(minHeight);

  useEffect(() => {
    const iframe = frame.current;
    if (!iframe) return;

    // allow-same-origin without allow-scripts: the page can patch the document,
    // but nothing typed in the playground is able to execute.
    const patch = () => {
      const doc = iframe.contentDocument;
      const style = doc?.getElementById(USER_STYLE_ID);
      if (!doc || !style) return;
      style.textContent = css;
      if (doc.body.innerHTML !== html) doc.body.innerHTML = html;
      const needed = Math.min(doc.documentElement.scrollHeight, MAX_HEIGHT);
      setHeight((current) => Math.max(current, needed, minHeight));
    };

    patch();
    iframe.addEventListener('load', patch);
    return () => iframe.removeEventListener('load', patch);
  }, [html, css, minHeight]);

  // The preview is its own document, so it mirrors the page theme and follows every switch.
  useEffect(() => {
    const iframe = frame.current;
    if (!iframe) return;
    const root = document.documentElement;
    // While the frame is still loading its document has no root yet; the load listener covers it.
    const sync = () => {
      const target = iframe.contentDocument?.documentElement;
      if (target) target.dataset.theme = root.dataset.theme ?? 'light';
    };

    sync();
    iframe.addEventListener('load', sync);
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      iframe.removeEventListener('load', sync);
      observer.disconnect();
    };
  }, []);

  return (
    <iframe
      ref={frame}
      className={styles.frame}
      title={title}
      srcDoc={initialDoc}
      sandbox="allow-same-origin"
      style={{ height }}
    />
  );
}
