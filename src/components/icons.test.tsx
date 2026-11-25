import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AxisTitle } from './AxisTitle';
import * as icons from './icons';

describe('icons', () => {
  it.each(Object.entries(icons))('%s is decorative and hidden from screen readers', (_, Icon) => {
    const { container } = render(<Icon />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('draws the logo at the requested size, 44px by default', () => {
    const { container, rerender } = render(<icons.LogoMark />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '44');
    rerender(<icons.LogoMark size={28} />);
    expect(container.querySelector('svg')).toHaveAttribute('height', '28');
  });
});

describe('AxisTitle', () => {
  it('shows a row suffix as an arrow and keeps the word for screen readers', () => {
    const { container } = render(<AxisTitle title="justify-content & align-items (row)" />);
    expect(container).toHaveTextContent('justify-content & align-items (row)');
    expect(container.querySelector('.visually-hidden')).toHaveTextContent('(row)');
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  it('uses a different arrow for column', () => {
    const row = render(<AxisTitle title="a (row)" />).container.innerHTML;
    const column = render(<AxisTitle title="a (column)" />).container.innerHTML;
    expect(column).toContain('(column)');
    expect(column.replace('column', 'row')).not.toBe(row);
  });

  it('renders other titles unchanged, or the given children', () => {
    expect(render(<AxisTitle title="flex-wrap" />).container).toHaveTextContent(/^flex-wrap$/);
    expect(render(<AxisTitle title="grid">custom</AxisTitle>).container).toHaveTextContent(/^custom$/);
  });
});
