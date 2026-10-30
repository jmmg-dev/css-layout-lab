export type CodeLanguage = 'html' | 'css';

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const token = (type: string, value: string) => `<span class="tok-${type}">${escapeHtml(value)}</span>`;

const HTML_PATTERN = /<!--[\s\S]*?(?:-->|$)|<\/?[a-zA-Z][\w-]*(?:\s+[\w:-]+(?:=(?:"[^"]*"|'[^']*'))?)*\s*\/?>/g;
const ATTRIBUTE_PATTERN = /([\w:-]+)(=)("[^"]*"|'[^']*')?/g;

function highlightTag(tag: string) {
  if (tag.startsWith('<!--')) return token('comment', tag);

  const [, open, name, attributes, close] = /^(<\/?)([\w-]+)([\s\S]*?)(\s*\/?>)$/.exec(tag) ?? [];
  let output = token('punct', open) + token('tag', name);
  let cursor = 0;
  for (const match of attributes.matchAll(ATTRIBUTE_PATTERN)) {
    output += escapeHtml(attributes.slice(cursor, match.index));
    output += token('attr', match[1]) + token('punct', match[2]) + token('string', match[3] ?? '');
    cursor = match.index + match[0].length;
  }
  return output + escapeHtml(attributes.slice(cursor)) + token('punct', close);
}

function highlightHtml(code: string) {
  let output = '';
  let cursor = 0;
  for (const match of code.matchAll(HTML_PATTERN)) {
    output += escapeHtml(code.slice(cursor, match.index));
    output += highlightTag(match[0]);
    cursor = match.index + match[0].length;
  }
  return output + escapeHtml(code.slice(cursor));
}

const CSS_PATTERN =
  /\/\*[\s\S]*?(?:\*\/|$)|"[^"]*"?|'[^']*'?|@[\w-]+|#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:[a-zA-Z%]+)?|[{}:;]|[.#]?[a-zA-Z_-][\w-]*/g;

function highlightCss(code: string) {
  let output = '';
  let cursor = 0;
  let depth = 0;
  let inValue = false;
  let lastPunctuation = '';

  for (const match of code.matchAll(CSS_PATTERN)) {
    const value = match[0];
    const end = match.index + value.length;
    output += escapeHtml(code.slice(cursor, match.index));
    cursor = end;

    if (value.startsWith('/*')) {
      output += token('comment', value);
    } else if (value.startsWith('"') || value.startsWith("'")) {
      output += token('string', value);
    } else if (value === '{' || value === '}' || value === ';') {
      depth += value === '{' ? 1 : value === '}' ? -1 : 0;
      inValue = false;
      lastPunctuation = value;
      output += token('punct', value);
    } else if (value === ':') {
      if (depth > 0 && lastPunctuation === 'property') inValue = true;
      output += token('punct', value);
    } else if (value.startsWith('@')) {
      output += token('keyword', value);
    } else if (inValue) {
      output += token(/^[#\d.-]/.test(value) && !/^-[a-zA-Z]/.test(value) ? 'number' : 'value', value);
    } else if (depth > 0 && /^\s*:/.test(code.slice(end)) && !value.startsWith('.')) {
      lastPunctuation = 'property';
      output += token('property', value);
    } else {
      output += token('selector', value);
    }
  }
  return output + escapeHtml(code.slice(cursor));
}

/** Returns safe HTML. Used on the server and in the editor, so output must stay deterministic. */
export function highlight(code: string, language: CodeLanguage) {
  return language === 'html' ? highlightHtml(code) : highlightCss(code);
}
