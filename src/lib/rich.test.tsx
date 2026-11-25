import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { richTags, stripTags, truncate } from './rich';

describe('richTags.b', () => {
  it('marks CSS terms as keywords', () => {
    const { container } = render(richTags.b('flex-wrap'));
    expect(container.querySelector('strong')).toHaveClass('keyword');
  });

  it('gives terms of the align and grid family the sky tone', () => {
    const { container } = render(richTags.b(['align', '-items']));
    expect(container.querySelector('strong')).toHaveClass('keyword', 'tone-sky');
  });

  it('leaves ordinary words without a class', () => {
    const { container } = render(richTags.b('items'));
    expect(container.querySelector('strong')).not.toHaveAttribute('class');
  });

  it('ignores chunks that are not plain text', () => {
    const { container } = render(richTags.b(<em>grid</em>));
    expect(container.querySelector('strong')).not.toHaveAttribute('class');
  });
});

describe('richTags markup', () => {
  it('wraps each tag in its element and class', () => {
    const { container } = render(
      <>
        {richTags.brick('grid')}
        {richTags.brick('flex')}
        {richTags.moss('a')}
        {richTags.blue('b')}
        {richTags.code('c')}
        {richTags.p('d')}
        {richTags.h('e')}
      </>,
    );
    const [grid, flex] = container.querySelectorAll('.brick');
    expect(grid).toHaveClass('tone-sky');
    expect(flex).not.toHaveClass('tone-sky');
    expect(container.querySelector('.moss')).toHaveTextContent('a');
    expect(container.querySelector('.blue')).toHaveTextContent('b');
    expect(container.querySelector('code')).toHaveTextContent('c');
    expect(container.querySelector('p')).toHaveTextContent('d');
    expect(container.querySelector('.list-heading')).toHaveTextContent('e');
  });
});

describe('stripTags', () => {
  it('removes tags and collapses whitespace', () => {
    expect(stripTags('  <b>flex</b>   en\n<code>CSS</code> ')).toBe('flex en CSS');
  });
});

describe('truncate', () => {
  it('keeps text that already fits', () => {
    expect(truncate('short text', 20)).toBe('short text');
  });

  it('cuts on the last word boundary and adds an ellipsis', () => {
    expect(truncate('one two three four', 12)).toBe('one two…');
  });

  it('uses 158 characters by default', () => {
    const text = 'word '.repeat(50).trim();
    const result = truncate(text);
    expect(result.length).toBeLessThanOrEqual(159);
    expect(result.endsWith('…')).toBe(true);
  });
});
