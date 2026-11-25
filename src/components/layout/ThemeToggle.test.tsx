import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { THEME_KEY, ThemeToggle, themeScript } from './ThemeToggle';

const root = document.documentElement;
// The script is inlined in the page head; running it here is the closest equivalent.
const runThemeScript = () => new Function(themeScript)();

describe('ThemeToggle', () => {
  it('switches between light and dark and remembers the choice', async () => {
    render(<ThemeToggle label="Toggle theme" />);
    const button = screen.getByRole('button', { name: 'Toggle theme' });

    await userEvent.click(button);
    expect(root.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_KEY)).toBe('dark');

    await userEvent.click(button);
    expect(root.dataset.theme).toBe('light');
    expect(localStorage.getItem(THEME_KEY)).toBe('light');
  });

  it('still switches when the browser blocks storage', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<ThemeToggle label="Toggle theme" />);
    await userEvent.click(screen.getByRole('button'));
    expect(root.dataset.theme).toBe('dark');
  });
});

describe('themeScript', () => {
  it('applies a saved theme', () => {
    localStorage.setItem(THEME_KEY, 'dark');
    runThemeScript();
    expect(root.dataset.theme).toBe('dark');
  });

  it('follows the system preference when nothing valid is saved', () => {
    localStorage.setItem(THEME_KEY, 'purple');
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    runThemeScript();
    expect(root.dataset.theme).toBe('dark');
  });

  it('never breaks the page if storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(runThemeScript).not.toThrow();
  });
});
