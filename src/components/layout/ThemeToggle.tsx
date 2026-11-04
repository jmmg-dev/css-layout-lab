'use client';

import { MoonIcon, SunIcon } from '../icons';
import styles from './SiteHeader.module.css';

export const THEME_KEY = 'theme';

/**
 * Runs before the first paint so the page never flashes the wrong theme. It honours a saved
 * choice and otherwise follows the system preference.
 */
export const themeScript = `(function () {
  try {
    var theme = localStorage.getItem('${THEME_KEY}');
    if (theme !== 'light' && theme !== 'dark') {
      theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.dataset.theme = theme;
  } catch (error) {}
})();`;

// Both icons are rendered and CSS shows the right one, so the server markup never depends on the theme.
export function ThemeToggle({ label }: { label: string }) {
  const toggle = () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
  };

  return (
    <button type="button" className={styles.theme} aria-label={label} onClick={toggle}>
      <SunIcon />
      <MoonIcon />
    </button>
  );
}
