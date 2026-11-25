import { describe, expect, it } from 'vitest';
import { highlight } from './highlight';

/** Collects [type, text] pairs from the highlighted HTML, ignoring plain text between tokens. */
const tokens = (html: string) =>
  [...new DOMParser().parseFromString(html, 'text/html').querySelectorAll('span')].map((span) => [
    span.className.replace('tok-', ''),
    span.textContent,
  ]);

describe('highlight html', () => {
  it('splits a tag into punctuation, name, attributes and strings', () => {
    expect(tokens(highlight('<div class="box">', 'html'))).toEqual([
      ['punct', '<'],
      ['tag', 'div'],
      ['attr', 'class'],
      ['punct', '='],
      ['string', '"box"'],
      ['punct', '>'],
    ]);
  });

  it('highlights closing and self-closing tags, keeping attributes without a value as text', () => {
    const output = highlight('</p><input disabled />', 'html');
    expect(tokens(output)).toEqual([
      ['punct', '</'],
      ['tag', 'p'],
      ['punct', '>'],
      ['punct', '<'],
      ['tag', 'input'],
      ['punct', ' />'],
    ]);
    expect(new DOMParser().parseFromString(output, 'text/html').body.textContent).toBe('</p><input disabled />');
  });

  it('leaves a tag with an unquoted attribute value as escaped text', () => {
    expect(highlight('<a href=x>', 'html')).toBe('&lt;a href=x&gt;');
  });

  it('marks comments', () => {
    expect(tokens(highlight('<!-- note -->', 'html'))).toEqual([['comment', '<!-- note -->']]);
  });

  it('escapes text so user code can never inject markup', () => {
    const output = highlight('a < b & c', 'html');
    expect(output).toBe('a &lt; b &amp; c');
  });

  it('keeps the text between tags', () => {
    const output = highlight('<b>hi</b>', 'html');
    expect(new DOMParser().parseFromString(output, 'text/html').body.textContent).toBe('<b>hi</b>');
  });
});

describe('highlight css', () => {
  it('tells selectors, properties, values and numbers apart', () => {
    expect(tokens(highlight('.box { display: flex; gap: 1rem; }', 'css'))).toEqual([
      ['selector', '.box'],
      ['punct', '{'],
      ['property', 'display'],
      ['punct', ':'],
      ['value', 'flex'],
      ['punct', ';'],
      ['property', 'gap'],
      ['punct', ':'],
      ['number', '1rem'],
      ['punct', ';'],
      ['punct', '}'],
    ]);
  });

  it('highlights comments, strings, at-rules and colours', () => {
    const result = tokens(highlight('/* c */ @media x { a { content: "q"; color: #fff; } }', 'css'));
    expect(result).toContainEqual(['comment', '/* c */']);
    expect(result).toContainEqual(['keyword', '@media']);
    expect(result).toContainEqual(['string', '"q"']);
    expect(result).toContainEqual(['number', '#fff']);
  });

  it('treats negative keywords as values, not numbers', () => {
    expect(tokens(highlight('a { margin: -1px -webkit-box; }', 'css'))).toContainEqual(['value', '-webkit-box']);
  });

  it('does not take a pseudo-class colon for a property', () => {
    expect(tokens(highlight('a:hover { color: red; }', 'css')).slice(0, 3)).toEqual([
      ['selector', 'a'],
      ['punct', ':'],
      ['selector', 'hover'],
    ]);
  });

  it('keeps unterminated comments and strings highlighted', () => {
    expect(tokens(highlight('/* open', 'css'))).toEqual([['comment', '/* open']]);
    expect(tokens(highlight("a { content: 'x", 'css'))).toContainEqual(['string', "'x"]);
  });
});
