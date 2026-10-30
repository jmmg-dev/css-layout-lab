'use client';

import { useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { highlight, type CodeLanguage } from '@/lib/highlight';
import { CheckIcon, CopyIcon } from '../icons';
import styles from './Playground.module.css';

const TAB = '  ';

type Props = {
  language: CodeLanguage;
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  copyLabel: string;
  copiedLabel: string;
};

export function CodeEditor({ language, value, onChange, ariaLabel, copyLabel, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);
  const tabEscapes = useRef(false);
  const lineCount = value.split('\n').length;
  const highlighted = useMemo(() => highlight(value, language), [value, language]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value);

  // Tab indents, but Escape releases it so keyboard users are never trapped.
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape') {
      tabEscapes.current = true;
      return;
    }
    if (event.key !== 'Tab' || tabEscapes.current) {
      tabEscapes.current = false;
      return;
    }
    event.preventDefault();
    const target = event.currentTarget;
    const { selectionStart, selectionEnd } = target;
    target.setRangeText(TAB, selectionStart, selectionEnd, 'end');
    onChange(target.value);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={styles.editor}>
      <div className={styles.editorBar}>
        <span className={styles.language} data-language={language}>
          {language}
        </span>
        <button type="button" className={styles.iconButton} onClick={copy}>
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
        </button>
      </div>
      <div className={styles.editorBody}>
        <div className={styles.gutter} aria-hidden="true">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <div className={styles.codeStack}>
          <pre className={styles.codeLayer} aria-hidden="true">
            <code dangerouslySetInnerHTML={{ __html: `${highlighted}\n` }} />
          </pre>
          <textarea
            className={styles.codeInput}
            aria-label={ariaLabel}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
          />
        </div>
      </div>
    </div>
  );
}
