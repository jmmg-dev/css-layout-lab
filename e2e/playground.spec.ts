import { expect, messages, test } from './fixtures';

const ui = messages.en.ui;

test.describe('playground', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/flex/flex-wrap');
    // The preview gets its theme from a client effect: once it has one, React has hydrated
    // and typing reaches the playground state instead of a page that is not interactive yet.
    await expect(page.frameLocator(`iframe[title="${ui.previewTitle}"]`).locator('html[data-theme]')).toHaveCount(1);
  });

  const cssEditor = (page: import('@playwright/test').Page) =>
    page.getByRole('textbox', { name: ui.editorLabel.replace('{language}', 'CSS') });
  const preview = (page: import('@playwright/test').Page) => page.frameLocator(`iframe[title="${ui.previewTitle}"]`);
  const containerStyle = (page: import('@playwright/test').Page, property: string) =>
    preview(page)
      .locator('.container')
      .evaluate((element, name) => getComputedStyle(element).getPropertyValue(name), property);

  test('an option rewrites the CSS and the live result follows', async ({ page, expectCleanConsole }) => {
    await expect.poll(() => containerStyle(page, 'flex-wrap')).toBe('wrap');
    await page.getByRole('radio', { name: 'nowrap' }).check();
    await expect(cssEditor(page)).toHaveValue(/flex-wrap: nowrap;/);
    await expect.poll(() => containerStyle(page, 'flex-wrap')).toBe('nowrap');
    expectCleanConsole();
  });

  test('code typed in the editor shows in the result at once', async ({ page }) => {
    const editor = cssEditor(page);
    await editor.fill((await editor.inputValue()).replace('gap: 1rem;', 'gap: 3rem;'));
    await expect.poll(() => containerStyle(page, 'gap')).toBe('48px');
  });

  test('the width slider resizes the result and reset restores everything', async ({ page }) => {
    const slider = page.getByRole('slider', { name: new RegExp(`^${ui.previewWidth}`) });
    await expect(slider).toHaveValue('30');
    await slider.fill('80');
    await expect(page.getByText('80%', { exact: true })).toBeVisible();

    await page.getByRole('radio', { name: 'wrap-reverse' }).check();
    await page.getByRole('button', { name: ui.reset }).click();
    await expect(slider).toHaveValue('30');
    await expect(cssEditor(page)).toHaveValue(/flex-wrap: wrap;/);
  });

  test('full screen shows the section, keeps the code and closes with Escape', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Full screen is only offered on large screens.');
    await page.getByRole('radio', { name: 'nowrap' }).check();
    const open = page.getByRole('button', { name: ui.fullscreen, exact: true });
    await open.click();

    const dialog = page.getByRole('dialog', { name: `${ui.fullscreenTitle}: Flexbox - flex-wrap` });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('button', { name: new RegExp(ui.exitFullscreen) })).toBeFocused();
    await expect(cssEditor(page)).toHaveValue(/flex-wrap: nowrap;/);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
    await expect(cssEditor(page)).toHaveValue(/flex-wrap: nowrap;/);
  });

  test('full screen is not offered on small screens', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Checks the mobile layout.');
    await expect(page.getByRole('button', { name: ui.fullscreen, exact: true })).toBeHidden();
  });
});
