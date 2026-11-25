import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LocaleSwitcher } from './LocaleSwitcher';

vi.mock('next/navigation', () => ({ usePathname: () => '/es/flex/flex-wrap' }));

describe('LocaleSwitcher', () => {
  it('links to the same page in every language', () => {
    render(<LocaleSwitcher locale="es" />);
    expect(screen.getByRole('link', { name: 'es' })).toHaveAttribute('href', '/es/flex/flex-wrap');
    expect(screen.getByRole('link', { name: 'en' })).toHaveAttribute('href', '/en/flex/flex-wrap');
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
