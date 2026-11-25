import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchCommand, type SearchItem } from './SearchCommand';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const items: SearchItem[] = [
  { href: '/es/introduction', label: 'Introducción a los layouts', group: 'Fundamentos' },
  { href: '/es/flex/flex-wrap', label: 'flex-wrap', group: 'Flexbox' },
  { href: '/es/grid/subgrid', label: 'subgrid', group: 'Grid' },
];

const renderSearch = () =>
  render(<SearchCommand items={items} label="Buscar" placeholder="Busca una sección" empty="Sin resultados" />);

const dialog = () => document.querySelector('dialog')!;
const input = () => screen.getByRole('combobox', { hidden: true });
const options = () => screen.queryAllByRole('option', { hidden: true });

describe('SearchCommand', () => {
  beforeEach(() => push.mockReset());

  it('opens from its button with every page listed', async () => {
    renderSearch();
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(dialog()).toHaveAttribute('open');
    expect(options()).toHaveLength(3);
  });

  it('opens and closes with Ctrl+K or Cmd+K', () => {
    renderSearch();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(dialog()).toHaveAttribute('open');
    fireEvent.keyDown(window, { key: 'K', metaKey: true });
    expect(dialog()).not.toHaveAttribute('open');
  });

  it('ignores K without the modifier', () => {
    renderSearch();
    fireEvent.keyDown(window, { key: 'k' });
    expect(dialog()).not.toHaveAttribute('open');
  });

  it('filters by every word, ignoring accents and case', async () => {
    renderSearch();
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    await userEvent.type(input(), 'INTRODUCCION fundamentos');
    expect(options()).toHaveLength(1);
    expect(options()[0]).toHaveTextContent('Introducción a los layouts');
  });

  it('says so when nothing matches', async () => {
    renderSearch();
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    await userEvent.type(input(), 'zzz');
    expect(options()).toHaveLength(0);
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
    // Arrows do nothing without results.
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    expect(input()).not.toHaveAttribute('aria-activedescendant');
  });

  it('moves the selection with the arrows, wrapping around', async () => {
    renderSearch();
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(options()[0]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(input(), { key: 'ArrowUp' });
    expect(options()[2]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    expect(options()[0]).toHaveAttribute('aria-selected', 'true');
    expect(input()).toHaveAttribute('aria-activedescendant', options()[0].id);
  });

  it('opens the selected page with Enter and closes', async () => {
    renderSearch();
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(push).toHaveBeenCalledWith('/es/flex/flex-wrap');
    expect(dialog()).not.toHaveAttribute('open');
  });

  it('does nothing on Enter without results', async () => {
    renderSearch();
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    await userEvent.type(input(), 'zzz');
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(push).not.toHaveBeenCalled();
  });

  it('selects the option under the mouse and closes when a link is clicked', async () => {
    renderSearch();
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    const link = screen.getAllByRole('link', { hidden: true })[2];
    fireEvent.mouseMove(link);
    expect(options()[2]).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(link);
    expect(dialog()).not.toHaveAttribute('open');
  });

  it('closes when clicking the backdrop, not the panel', async () => {
    renderSearch();
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    fireEvent.click(input());
    expect(dialog()).toHaveAttribute('open');
    fireEvent.click(dialog());
    expect(dialog()).not.toHaveAttribute('open');
  });
});
