import { describe, expect, it } from 'vitest';
import { readDeclaration, writeDeclaration } from './css-edit';

const css = `.container {
  display: flex;
  gap: 1rem;
}

.child {
  padding: 1rem;
}
`;

describe('readDeclaration', () => {
  it('reads the value of a property in a rule', () => {
    expect(readDeclaration(css, '.container', 'display')).toBe('flex');
    expect(readDeclaration(css, '.child', 'padding')).toBe('1rem');
  });

  it('returns null when the rule does not exist', () => {
    expect(readDeclaration(css, '.missing', 'display')).toBeNull();
  });

  it('returns null when the property is not in the rule', () => {
    expect(readDeclaration(css, '.child', 'display')).toBeNull();
  });

  it('does not match a property that only ends with the same name', () => {
    expect(readDeclaration('.a {\n  row-gap: 2px;\n}', '.a', 'gap')).toBeNull();
  });

  it('collapses multi-line values into a single line', () => {
    const areas = `.grid {\n  grid-template-areas:\n    "a a"\n    "b c";\n}`;
    expect(readDeclaration(areas, '.grid', 'grid-template-areas')).toBe('"a a" "b c"');
  });

  it('treats selector characters literally', () => {
    const odd = '.a > .b {\n  order: 2;\n}';
    expect(readDeclaration(odd, '.a > .b', 'order')).toBe('2');
  });

  it('returns null for a rule that is never closed', () => {
    expect(readDeclaration('.a {\n  order: 2;', '.a', 'order')).toBeNull();
  });
});

describe('writeDeclaration', () => {
  it('replaces an existing value and keeps the rest of the code', () => {
    const result = writeDeclaration(css, '.container', 'display', 'grid');
    expect(readDeclaration(result, '.container', 'display')).toBe('grid');
    expect(result).toBe(css.replace('display: flex;', 'display: grid;'));
  });

  it('adds the property at the end of the rule when it is missing', () => {
    const result = writeDeclaration(css, '.child', 'order', '3');
    expect(result).toContain('.child {\n  padding: 1rem;\n  order: 3;\n}');
  });

  it('adds the property on a new line when the rule body ends on the same line', () => {
    const result = writeDeclaration('.a { color: red; }', '.a', 'order', '1');
    expect(result).toBe('.a { color: red; \n  order: 1;\n}');
  });

  it('appends a new rule when the selector does not exist', () => {
    const result = writeDeclaration(css, '.new', 'flex', '1');
    expect(result.endsWith('\n\n.new {\n  flex: 1;\n}\n')).toBe(true);
    expect(readDeclaration(result, '.new', 'flex')).toBe('1');
  });
});
