import { expect, messages, test } from './fixtures';

const { en, es } = messages;

test.describe('search', () => {
  test('finds a page without accents and opens it with Enter', async ({ page }) => {
    await page.goto('/es');
    await page.getByRole('button', { name: es.ui.search }).click();
    const input = page.getByRole('combobox', { name: es.ui.search });
    await input.fill('introduccion');
    await expect(page.getByRole('option')).toHaveCount(1);
    await input.press('Enter');
    await expect(page).toHaveURL(/\/es\/introduction$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(es.basicConcepts.title);
  });

  test('opens with Ctrl+K and closes with Escape', async ({ page, isMobile }) => {
    test.skip(isMobile, 'A keyboard shortcut.');
    await page.goto('/en');
    await page.keyboard.press('Control+k');
    const input = page.getByRole('combobox', { name: en.ui.search });
    await expect(input).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(input).toBeHidden();
  });
});

test.describe('site navigation', () => {
  test('the header links lead to each section', async ({ page, isMobile }) => {
    test.skip(isMobile, 'On small screens the header links give way to the side menu.');
    await page.goto('/en');
    await page
      .getByRole('navigation', { name: en.ui.mainNav })
      .first()
      .getByRole('link', { name: en.nav.grid })
      .click();
    await expect(page).toHaveURL(/\/en\/grid$/);
  });

  test('the side menu opens on small screens and closes after choosing a page', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'The collapsible menu is for small screens.');
    await page.goto('/en/flex');
    await page.getByRole('button', { name: en.ui.openMenu }).click();
    // The page also links to flex-wrap as "next page": the one in the menu is wanted.
    await page.getByRole('navigation', { name: en.ui.mainNav }).getByRole('link', { name: 'flex-wrap' }).click();
    await expect(page).toHaveURL(/\/en\/flex\/flex-wrap$/);
    await expect(page.getByRole('button', { name: en.ui.openMenu })).toHaveAttribute('aria-expanded', 'false');
  });

  test('the footer links lead to each section', async ({ page }) => {
    await page.goto('/es/grid');
    await page
      .getByRole('navigation', { name: es.ui.footerSections })
      .getByRole('link', { name: es.nav.beyond })
      .click();
    await expect(page).toHaveURL(/\/es\/container-queries$/);
  });
});

test.describe('support', () => {
  test('the heart in the header brings the support card into view', async ({ page }) => {
    await page.goto('/en/flex');
    await page.getByRole('link', { name: en.home.support.title }).click();
    await expect(page).toHaveURL(/\/en#support$/);
    await expect(page.getByRole('heading', { name: en.home.support.title })).toBeInViewport();
  });

  test('the Ko-fi button opens the Ko-fi page in a new tab', async ({ page }) => {
    await page.goto('/en');
    const kofi = page.getByRole('link', { name: en.home.support.methods.kofi });
    await expect(kofi).toHaveAttribute('href', 'https://ko-fi.com/jmmgdev');
    await expect(kofi).toHaveAttribute('target', '_blank');
  });
});
