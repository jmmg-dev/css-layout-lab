import { test as base, expect } from '@playwright/test';
import en from '../messages/en.json';
import es from '../messages/es.json';

export const messages = { en, es };

/**
 * A page that collects console errors, uncaught exceptions and failed requests to the site
 * itself. Tests call expectCleanConsole() at the end; third-party requests are ignored.
 */
export const test = base.extend<{ problems: string[]; expectCleanConsole: () => void }>({
  // The setter is named provide, not use: ESLint would take use() for the React hook.
  problems: async ({ page, baseURL }, provide) => {
    const problems: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') problems.push(`console: ${message.text()}`);
    });
    page.on('pageerror', (error) => problems.push(`exception: ${error.message}`));
    page.on('response', (response) => {
      if (response.url().startsWith(baseURL!) && response.status() >= 400) {
        problems.push(`${response.status()} ${response.url()}`);
      }
    });
    await provide(problems);
  },
  expectCleanConsole: async ({ problems }, provide) => {
    await provide(() => expect(problems, problems.join('\n')).toEqual([]));
  },
});

export { expect };
