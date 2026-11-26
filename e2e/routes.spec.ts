import AxeBuilder from '@axe-core/playwright';
import { pages } from '../src/content/pages';
import { expect, messages, test } from './fixtures';

const locales = ['es', 'en'] as const;

// Same source as the sitemap: the page registry in every language, plus each home page.
const routes = locales.flatMap((locale) =>
  ['', ...pages.map((page) => page.path)].map((path) => `/${locale}${path ? `/${path}` : ''}`),
);

test.describe('every route', () => {
  for (const route of routes) {
    test(`${route} loads with one heading, a title and no errors`, async ({ page, expectCleanConsole }, testInfo) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1:visible')).toHaveCount(1);
      await expect(page).toHaveTitle(/\S/);
      // Checked before axe: it tries to inject itself into the sandboxed preview iframe, and the
      // browser logs that block as an error that does not come from the site.
      expectCleanConsole();

      // Accessibility once per page is enough: the desktop run covers it.
      if (testInfo.project.name === 'desktop') {
        const { violations } = await new AxeBuilder({ page }).analyze();
        const serious = violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
        expect(
          serious.map(
            (violation) =>
              `${violation.id}: ${violation.help} → ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
          ),
        ).toEqual([]);
      }
    });
  }

  test('the sitemap lists exactly these routes', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();
    const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
    expect(listed.sort()).toEqual([...routes].sort());
  });
});

test.describe('missing pages and languages', () => {
  for (const locale of locales) {
    test(`a page that does not exist in ${locale} is a real 404 with the site design`, async ({ page }) => {
      const response = await page.goto(`/${locale}/no-such-page`);
      expect(response?.status()).toBe(404);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(messages[locale].ui.notFoundTitle);
      await expect(page.getByRole('link', { name: messages[locale].ui.backHome })).toHaveAttribute(
        'href',
        `/${locale}`,
      );
    });
  }

  test('an unknown language is redirected to a real one', async ({ page }) => {
    await page.goto('/xx/flex');
    await expect(page).toHaveURL(/\/en\/xx\/flex$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(messages.en.ui.notFoundTitle);
  });

  test('the root goes to the language of the browser', async ({ browser, baseURL }) => {
    for (const [locale, expected] of [
      ['es-ES', '/es'],
      ['en-GB', '/en'],
    ]) {
      const context = await browser.newContext({ locale, baseURL });
      const page = await context.newPage();
      await page.goto('/');
      await expect(page).toHaveURL(new RegExp(`${expected}$`));
      await context.close();
    }
  });
});
