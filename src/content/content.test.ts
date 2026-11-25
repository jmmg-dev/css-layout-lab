import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import es from '../../messages/es.json';
import { readDeclaration, writeDeclaration } from '@/lib/css-edit';
import { defaultElements } from './default-elements';
import { examples } from './examples';
import { getGroupPages, getPage, getPageNumber, getSiblings, groups, pages } from './pages';

type Messages = Record<string, unknown>;

/** Every leaf key of a messages catalog, as dotted paths. */
const keys = (messages: Messages, prefix = ''): string[] =>
  Object.entries(messages).flatMap(([key, value]) =>
    value && typeof value === 'object' ? keys(value as Messages, `${prefix}${key}.`) : [`${prefix}${key}`],
  );

const has = (messages: Messages, path: string) =>
  path.split('.').reduce<unknown>((node, key) => (node as Messages | undefined)?.[key], messages) !== undefined;

describe('pages', () => {
  it('finds a page by its path, and nothing for an unknown one', () => {
    expect(getPage('flex/flex-wrap')?.ns).toBe('flex.wrap');
    expect(getPage('nope')).toBeUndefined();
  });

  it('has unique paths', () => {
    expect(new Set(pages.map((page) => page.path)).size).toBe(pages.length);
  });

  it('starts every group at a page that exists in that group', () => {
    for (const group of groups) {
      expect(getPage(group.path)?.group).toBe(group.id);
    }
  });

  it('numbers pages from 1 inside their group', () => {
    const flex = getGroupPages('flex');
    expect(getPageNumber(flex[0])).toBe(1);
    expect(getPageNumber(flex[flex.length - 1])).toBe(flex.length);
  });

  it('links each page to the previous and next ones, with none at the ends', () => {
    expect(getSiblings(pages[0].path)).toEqual({ previous: undefined, next: pages[1] });
    expect(getSiblings(pages[1].path)).toEqual({ previous: pages[0], next: pages[2] });
    expect(getSiblings(pages[pages.length - 1].path).next).toBeUndefined();
  });

  it('points every page with an example to one that exists', () => {
    for (const page of pages.filter((page) => page.example)) {
      expect(examples[page.example!], page.path).toBeDefined();
    }
  });

  it('has a title for every page in both languages', () => {
    for (const page of pages) {
      expect(has(es, `${page.ns}.title`), `es ${page.ns}`).toBe(true);
      expect(has(en, `${page.ns}.title`), `en ${page.ns}`).toBe(true);
    }
  });
});

describe('examples', () => {
  const entries = Object.entries(examples);

  it('starts the width control within the slider range', () => {
    for (const [id, example] of entries) {
      expect(example.initialWidth ?? 100, id).toBeGreaterThanOrEqual(20);
      expect(example.initialWidth ?? 100, id).toBeLessThanOrEqual(100);
    }
  });

  it('can apply every option of every property selector to its CSS', () => {
    for (const [id, example] of entries) {
      for (const control of example.controls ?? []) {
        if (control.kind !== 'property') continue;
        expect(example.css, `${id}: ${control.selector}`).toMatch(
          new RegExp(`^${control.selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`, 'm'),
        );
        for (const option of control.options) {
          const css = writeDeclaration(example.css, control.selector, control.property, option);
          expect(readDeclaration(css, control.selector, control.property), `${id}: ${option}`).toBe(option);
        }
      }
    }
  });

  it('gives each preset its own snippet', () => {
    for (const [id, example] of entries) {
      for (const control of example.controls ?? []) {
        if (control.kind !== 'preset') continue;
        const snippets = control.options.map((option) => option.html + option.css);
        expect(new Set(snippets).size, id).toBe(snippets.length);
      }
    }
  });

  it('has the label of every selector in both languages', () => {
    for (const [id, example] of entries) {
      for (const control of example.controls ?? []) {
        expect(has(es, control.labelKey), `es ${id}`).toBe(true);
        expect(has(en, control.labelKey), `en ${id}`).toBe(true);
      }
    }
  });
});

describe('messages', () => {
  it('has the same keys in Spanish and English', () => {
    expect(keys(en).sort()).toEqual(keys(es).sort());
  });
});

describe('default elements', () => {
  it('lists elements written as tags', () => {
    for (const element of Object.values(defaultElements).flat()) {
      expect(element).toMatch(/^<[a-z0-9]+>/);
    }
  });
});
