import { expect, messages, test } from './fixtures';

const { en, es } = messages;

test.describe('language', () => {
  test('switching language keeps the page and is remembered', async ({ page }) => {
    await page.goto('/es/flex/flex-wrap');
    await page.getByRole('link', { name: 'en', exact: true }).click();
    await expect(page).toHaveURL(/\/en\/flex\/flex-wrap$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // The choice is stored, so the root now opens in English even for a Spanish browser.
    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
  });

  test('every text follows the language', async ({ page }) => {
    await page.goto('/es');
    await expect(page.getByRole('button', { name: es.ui.toggleTheme })).toBeVisible();
    await page.goto('/en');
    await expect(page.getByRole('button', { name: en.ui.toggleTheme })).toBeVisible();
  });
});

test.describe('theme', () => {
  test('dark mode is kept across pages and reloads', async ({ page }) => {
    await page.goto('/en');
    const html = page.locator('html');
    const startsDark = (await html.getAttribute('data-theme')) === 'dark';
    const other = startsDark ? 'light' : 'dark';

    await page.getByRole('button', { name: en.ui.toggleTheme }).click();
    await expect(html).toHaveAttribute('data-theme', other);

    await page.goto('/en/grid');
    await expect(html).toHaveAttribute('data-theme', other);
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', other);
  });

  test('the example preview follows the theme', async ({ page }) => {
    await page.goto('/en/flex/flex-wrap');
    await page.getByRole('button', { name: en.ui.toggleTheme }).click();
    const theme = await page.locator('html').getAttribute('data-theme');
    await expect(page.frameLocator(`iframe[title="${en.ui.previewTitle}"]`).locator('html')).toHaveAttribute(
      'data-theme',
      theme!,
    );
  });
});
