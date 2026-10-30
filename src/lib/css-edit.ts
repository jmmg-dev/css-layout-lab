const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function findRuleBody(css: string, selector: string) {
  const match = new RegExp(`^${escapeRegExp(selector)}\\s*\\{`, 'm').exec(css);
  if (!match) return null;
  const start = match.index + match[0].length;
  const end = css.indexOf('}', start);
  return end === -1 ? null : { start, end };
}

const declarationPattern = (property: string) =>
  new RegExp(`(^|[\\s;])(${escapeRegExp(property)}\\s*:\\s*)([^;}]*)`);

/** Reads a declaration value from a top-level rule, or null when it is not present. */
export function readDeclaration(css: string, selector: string, property: string) {
  const body = findRuleBody(css, selector);
  if (!body) return null;
  const match = declarationPattern(property).exec(css.slice(body.start, body.end));
  return match ? match[3].trim().replace(/\s+/g, ' ') : null;
}

/** Writes a declaration value, keeping the rest of the user's code untouched. */
export function writeDeclaration(css: string, selector: string, property: string, value: string) {
  const body = findRuleBody(css, selector);
  if (!body) return `${css.trimEnd()}\n\n${selector} {\n  ${property}: ${value};\n}\n`;

  const content = css.slice(body.start, body.end);
  const match = declarationPattern(property).exec(content);
  if (match) {
    const valueStart = body.start + match.index + match[1].length + match[2].length;
    return css.slice(0, valueStart) + value + css.slice(valueStart + match[3].length);
  }

  const insertion = content.endsWith('\n') ? `  ${property}: ${value};\n` : `\n  ${property}: ${value};\n`;
  return css.slice(0, body.end) + insertion + css.slice(body.end);
}
