'use client';

import { useId, useState, type ReactNode } from 'react';
import type { Control, Example } from '@/content/types';
import { readDeclaration, writeDeclaration } from '@/lib/css-edit';
import { ResetIcon } from '../icons';
import { CodeEditor } from './CodeEditor';
import { Preview } from './Preview';
import styles from './Playground.module.css';

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

  const reset = () => {
    setHtml(example.html);
    setCss(example.css);
    setWidth(initialWidth);
  };

  return (
    <div className={styles.playground}>
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
              min={30}
              max={100}
              step={1}
              value={width}
              onChange={(event) => setWidth(Number(event.target.value))}
            />
            <output>{width}%</output>
          </label>
        </div>
        <div className={styles.canvas}>
          <div className={styles.canvasInner} style={{ width: `${width}%` }}>
            <Preview html={html} css={css} initialDoc={initialDoc} minHeight={example.height} title={labels.previewTitle} />
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

      <div className={styles.footer}>
        <p>{labels.hint}</p>
        <button type="button" className={styles.iconButton} onClick={reset}>
          <ResetIcon />
          {labels.reset}
        </button>
      </div>
    </div>
  );
}
