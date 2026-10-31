'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRightIcon, SearchIcon } from '../icons';
import styles from './SearchCommand.module.css';

export type SearchItem = { href: string; label: string; group: string };

type Props = { items: SearchItem[]; label: string; placeholder: string; empty: string };

// Accents are dropped so "introduccion" still finds "Introducción".
const normalize = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

const matches = (item: SearchItem, words: string[]) => {
  const haystack = normalize(`${item.label} ${item.group}`);
  return words.every((word) => haystack.includes(word));
};

export function SearchCommand({ items, label, placeholder, empty }: Props) {
  const id = useId();
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const words = normalize(query).split(/\s+/).filter(Boolean);
  const results = items.filter((item) => matches(item, words));
  const optionId = (index: number) => `${id}-option-${index}`;

  const open = () => {
    setQuery('');
    setActive(0);
    dialog.current?.showModal();
  };

  const close = () => dialog.current?.close();

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.ctrlKey || event.metaKey)) return;
      // Browsers bind this combination to their own search box.
      event.preventDefault();
      if (dialog.current?.open) close();
      else open();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    list.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (results.length === 0) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((current) => (current + step + results.length) % results.length);
    }
    if (event.key === 'Enter' && results[active]) {
      event.preventDefault();
      close();
      router.push(results[active].href);
    }
  };

  return (
    <>
      <button type="button" className={styles.trigger} aria-label={label} onClick={open}>
        <SearchIcon />
        <span className={styles.triggerLabel}>{label}</span>
        <kbd className={styles.shortcut}>Ctrl K</kbd>
      </button>

      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-label={label}
        onClick={(event) => event.target === dialog.current && close()}
      >
        <div className={styles.panel}>
          <div className={styles.field}>
            <SearchIcon />
            <input
              role="combobox"
              aria-autocomplete="list"
              aria-controls={`${id}-results`}
              aria-expanded={results.length > 0}
              aria-activedescendant={results[active] ? optionId(active) : undefined}
              aria-label={label}
              autoComplete="off"
              placeholder={placeholder}
              spellCheck={false}
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKeyDown}
            />
            <kbd className={styles.shortcut}>Esc</kbd>
          </div>

          {results.length > 0 ? (
            <ul ref={list} id={`${id}-results`} role="listbox" aria-label={label} className={styles.results}>
              {results.map((item, index) => (
                <li key={item.href} id={optionId(index)} role="option" aria-selected={index === active}>
                  <Link href={item.href} onClick={close} onMouseMove={() => setActive(index)}>
                    <span>{item.label}</span>
                    <small>{item.group}</small>
                    <ArrowRightIcon />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>{empty}</p>
          )}
        </div>
      </dialog>
    </>
  );
}
