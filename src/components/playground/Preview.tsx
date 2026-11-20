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
  /** Used until the content has been measured, so the server render already has a sensible size. */
  minHeight: number;
  title: string;
};

export function Preview({ html, css, initialDoc, minHeight, title }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(minHeight);

  useEffect(() => {
    const iframe = frame.current;
    if (!iframe) return;

    // The frame is collapsed for a moment so the document reports its content height,
    // not the frame's. Nothing is painted in between, so it never flickers.
    const fit = () => {
      const doc = iframe.contentDocument;
      if (!doc?.body) return;
      const previous = iframe.style.height;
      iframe.style.height = '0px';
      // The frame only lays out again once the page has.
      iframe.getBoundingClientRect();
      const content = doc.documentElement.scrollHeight;
      // Content wider than the frame adds a horizontal scrollbar, which takes height
      // from the frame: measured at the fitted height and added, so no vertical scroll appears.
      iframe.style.height = `${content}px`;
      iframe.getBoundingClientRect();
      const scrollbar = (iframe.contentWindow?.innerHeight ?? content) - doc.documentElement.clientHeight;
      iframe.style.height = previous;
      setHeight(Math.min(content + Math.max(scrollbar, 0), MAX_HEIGHT));
    };

    // allow-same-origin without allow-scripts: the page can patch the document,
    // but nothing typed in the playground is able to execute.
    const patch = () => {
      const doc = iframe.contentDocument;
      const style = doc?.getElementById(USER_STYLE_ID);
      if (!doc || !style) return;
      style.textContent = css;
      if (doc.body.innerHTML !== html) doc.body.innerHTML = html;
      fit();
    };

    patch();
    iframe.addEventListener('load', patch);
    // A narrower frame wraps the content onto more lines, so its height is fitted again.
    let lastWidth = iframe.clientWidth;
    const resize = new ResizeObserver(() => {
      if (iframe.clientWidth === lastWidth) return;
      lastWidth = iframe.clientWidth;
      fit();
    });
    resize.observe(iframe);
    return () => {
      iframe.removeEventListener('load', patch);
      resize.disconnect();
    };
  }, [html, css]);

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
