import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SideNav, type NavGroup } from './SideNav';

let pathname = '/es/flex/flex-wrap';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

const groups: NavGroup[] = [
  {
    id: 'flex',
    label: 'Flexbox',
    links: [
      { href: '/es/flex', number: '01', label: 'flex' },
      { href: '/es/flex/flex-wrap', number: '02', label: 'flex-wrap' },
      { href: '/es/flex/justify-align-row', number: '03', label: 'justify-content (row)' },
    ],
  },
];

const renderNav = () =>
  render(
    <SideNav
      groups={groups}
      label="Secciones"
      openLabel="Abrir menú"
      closeLabel="Cerrar menú"
      support={{ href: '/es#support', label: 'Apoyar' }}
    />,
  );

/** Places the menu and its active link: jsdom does no layout. */
function layout(list: DOMRect, link: DOMRect) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    return this.tagName === 'A' ? link : list;
  });
}

const rect = (top: number, height: number) => ({ top, height, bottom: top + height }) as DOMRect;

describe('SideNav', () => {
  beforeEach(() => {
    pathname = '/es/flex/flex-wrap';
  });

  it('lists every group and marks the current page', () => {
    renderNav();
    expect(screen.getByRole('heading', { name: 'Flexbox' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /flex-wrap/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'flex' })).not.toHaveAttribute('aria-current');
  });

  it('opens and closes on small screens with its toggle', async () => {
    renderNav();
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation')).toHaveAttribute('data-open', 'true');
  });

  it('closes after following a link or the support link', async () => {
    renderNav();
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    await userEvent.click(screen.getByRole('link', { name: 'flex' }));
    expect(screen.getByRole('navigation')).toHaveAttribute('data-open', 'false');

    await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    await userEvent.click(screen.getByRole('link', { name: 'Apoyar' }));
    expect(screen.getByRole('navigation')).toHaveAttribute('data-open', 'false');
  });

  it('keeps its scroll when the active link is already visible', () => {
    layout(rect(0, 500), rect(100, 30));
    const { container } = renderNav();
    expect((container.firstChild as HTMLElement).scrollTop).toBe(0);
  });

  it('scrolls a hidden active link to the centre', () => {
    layout(rect(0, 500), rect(900, 30));
    const { container } = renderNav();
    // 900 - 0 - (500 - 30) / 2
    expect((container.firstChild as HTMLElement).scrollTop).toBe(665);
  });

  it('does not scroll when no link is active', () => {
    pathname = '/es';
    const { container } = renderNav();
    expect((container.firstChild as HTMLElement).scrollTop).toBe(0);
  });
});
