import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocaleSwitcher } from './LocaleSwitcher';

vi.mock('next/navigation', () => ({ usePathname: () => '/es/flex/flex-wrap' }));

afterEach(() => {
  document.cookie = 'NEXT_LOCALE=; path=/; max-age=0';
});

describe('LocaleSwitcher', () => {
  it('links to the same page in every language', () => {
    render(<LocaleSwitcher locale="es" />);
    expect(screen.getByRole('link', { name: 'es' })).toHaveAttribute('href', '/es/flex/flex-wrap');
    expect(screen.getByRole('link', { name: 'en' })).toHaveAttribute('href', '/en/flex/flex-wrap');
  });

  it('remembers the chosen language in the locale cookie', () => {
    render(<LocaleSwitcher locale="es" />);
    fireEvent.click(screen.getByRole('link', { name: 'en' }));
    expect(document.cookie).toContain('NEXT_LOCALE=en');
  });

  it('marks the current language', () => {
    render(<LocaleSwitcher locale="es" />);
    expect(screen.getByRole('link', { name: 'es' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'en' })).not.toHaveAttribute('aria-current');
  });

  it('names each link in its own language', () => {
    render(<LocaleSwitcher locale="en" />);
    expect(screen.getByRole('link', { name: 'en' })).toHaveAttribute('lang', 'en');
    expect(screen.getByRole('link', { name: 'es' })).toHaveAttribute('hreflang', 'es');
  });
});
