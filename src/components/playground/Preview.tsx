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
