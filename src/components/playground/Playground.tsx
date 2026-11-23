'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { Control, Example } from '@/content/types';
import { readDeclaration, writeDeclaration } from '@/lib/css-edit';
import { CloseIcon, ExpandIcon, LogoMark, ResetIcon } from '../icons';
import { CodeEditor } from './CodeEditor';
import { Preview } from './Preview';
import styles from './Playground.module.css';

const MIN_WIDTH = 20;
/** Full screen is offered only where there is room for it; keep in step with the CSS. */
const LARGE_SCREEN = '(min-width: 1024px)';

export type PlaygroundLabels = {
  result: string;
  live: string;
  hint: string;
  reset: string;
  copy: string;
  copied: string;
  custom: string;
  previewWidth: string;
  previewTitle: string;
  htmlEditor: string;
  cssEditor: string;
  fullscreen: string;
  exitFullscreen: string;
  fullscreenTitle: string;
  /** Site section and title the example belongs to, shown at the top of full screen. */
  sectionGroup?: string;
  sectionTitle: string;
};

type Props = {
  example: Example;
  /** Rendered by the server: a client component never receives message catalogs. */
  controlLabels: ReactNode[];
  initialDoc: string;
  labels: PlaygroundLabels;
};

function currentValue(control: Control, html: string, css: string) {
  if (control.kind === 'property') return readDeclaration(css, control.selector, control.property);
  return control.options.find((option) => option.html === html && option.css === css)?.value ?? null;
}

export function Playground({ example, controlLabels, initialDoc, labels }: Props) {
  const id = useId();
  const [html, setHtml] = useState(example.html);
  const [css, setCss] = useState(example.css);
  const initialWidth = example.initialWidth ?? 100;
  const [width, setWidth] = useState(initialWidth);

  const pick = (control: Control, value: string) => {
    if (control.kind === 'property') {
      setCss((code) => writeDeclaration(code, control.selector, control.property, value));
      return;
    }
    const preset = control.options.find((option) => option.value === value);
    if (preset) {
      setHtml(preset.html);
      setCss(preset.css);
    }
  };

  // The example is a dialog shown in the page. Full screen reopens it as a modal, which puts it
  // in the top layer: the browser adds the backdrop, keeps focus inside and closes it on Escape.
  // The DOM never moves, so the preview iframe keeps its state.
  const dialog = useRef<HTMLDialogElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);

  const expand = () => {
    const element = dialog.current;
    if (!element) return;
    element.close();
    element.showModal();
    setExpanded(true);
  };

  const collapse = () => dialog.current?.close();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    // Closing a modal (button, Escape) leaves it hidden: show it back in the page.
    const onClose = () => {
      if (element.open) return;
      element.show();
      setExpanded(false);
    };
    // In a code editor Escape only releases the Tab key, so it does not close full screen.
    // Cancelling the key press itself is what reliably stops the browser closing the dialog.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && event.target instanceof HTMLTextAreaElement) event.preventDefault();
    };
    element.addEventListener('close', onClose);
    element.addEventListener('keydown', onKeyDown);
    return () => {
      element.removeEventListener('close', onClose);
      element.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  // While in full screen the page behind does not scroll, and a window made small closes it.
  // On leaving, focus goes back to the button that opened it.
  const wasExpanded = useRef(false);
  useEffect(() => {
    if (!expanded) {
      if (wasExpanded.current) expandButton.current?.focus();
      wasExpanded.current = false;
      return;
    }
    wasExpanded.current = true;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    const large = window.matchMedia(LARGE_SCREEN);
    const onChange = () => {
      if (!large.matches) dialog.current?.close();
    };
    large.addEventListener('change', onChange);
    return () => {
      root.style.overflow = previous;
      large.removeEventListener('change', onChange);
    };
  }, [expanded]);

  const reset = () => {
    setHtml(example.html);
    setCss(example.css);
    setWidth(initialWidth);
  };

  return (
    <dialog
      ref={dialog}
      open
      className={styles.playground}
      aria-label={
        expanded
          ? `${labels.fullscreenTitle}: ${labels.sectionGroup ? `${labels.sectionGroup} - ` : ''}${labels.sectionTitle}`
          : undefined
      }
    >
      {expanded && (
        <div className={styles.modalBar}>
          <div className={styles.modalHeading}>
            <LogoMark size={36} />
            <p className={styles.modalTitle}>
              {labels.sectionGroup && <span className={styles.modalGroup}>{labels.sectionGroup} - </span>}
              {labels.sectionTitle}
            </p>
          </div>
          <button type="button" className={styles.closeButton} onClick={collapse} autoFocus>
            <CloseIcon />
            {labels.exitFullscreen}
            <kbd>Esc</kbd>
          </button>
        </div>
      )}

      {/* Selectors on the left, full screen and reset on the right. */}
      <div className={styles.toolbar}>
        <div className={styles.controls}>
          {example.controls?.map((control, index) => {
            const value = currentValue(control, html, css);
            const options = control.kind === 'property' ? control.options : control.options.map((o) => o.value);
            const isCustom = value === null || !options.includes(value);
            return (
              <fieldset key={control.labelKey} className={styles.control}>
                <legend>{controlLabels[index]}</legend>
                <div className={styles.chips}>
                  {options.map((option) => (
                    <label key={option} className={styles.chip}>
                      <input
                        type="radio"
                        name={`${id}-${index}`}
                        value={option}
                        checked={value === option}
                        onChange={() => pick(control, option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                  {isCustom && <span className={styles.customValue}>{value ?? labels.custom}</span>}
                </div>
              </fieldset>
            );
          })}
        </div>
        <div className={styles.actions}>
          {!expanded && (
            <button
              ref={expandButton}
              type="button"
              className={`${styles.iconButton} ${styles.expand}`}
              onClick={expand}
            >
              <ExpandIcon />
              {labels.fullscreen}
            </button>
          )}
          <button type="button" className={styles.iconButton} onClick={reset}>
            <ResetIcon />
            {labels.reset}
          </button>
        </div>
      </div>

      <div className={styles.stage}>
        <div className={styles.stageBar}>
          <span className={styles.result}>
            <span className={styles.liveDot} aria-hidden="true" />
            {labels.result}
            <span className={styles.liveLabel}>{labels.live}</span>
          </span>
          <label className={styles.widthControl}>
            <span>{labels.previewWidth}</span>
            <input
              type="range"
              // The track runs from 0 so the filled part matches the percentage;
              // the thumb stops at a minimum width that still shows the example.
              min={0}
              max={100}
              step={1}
              value={width}
              onChange={(event) => setWidth(Math.max(MIN_WIDTH, Number(event.target.value)))}
            />
            <output>{width}%</output>
          </label>
        </div>
        <div className={styles.canvas}>
          <div className={styles.canvasInner} style={{ width: `${width}%` }}>
            <Preview
              html={html}
              css={css}
              initialDoc={initialDoc}
              minHeight={example.height}
              title={labels.previewTitle}
            />
          </div>
        </div>
      </div>

      <div className={styles.editors}>
        <CodeEditor
          language="html"
          value={html}
          onChange={setHtml}
          ariaLabel={labels.htmlEditor}
          copyLabel={labels.copy}
          copiedLabel={labels.copied}
        />
        <CodeEditor
          language="css"
          value={css}
          onChange={setCss}
          ariaLabel={labels.cssEditor}
          copyLabel={labels.copy}
          copiedLabel={labels.copied}
        />
      </div>

      <p className={styles.footer}>{labels.hint}</p>
    </dialog>
  );
}
