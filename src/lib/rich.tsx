import type { ReactNode } from 'react';

type Chunks = ReactNode;

/** Layout models and the properties that drive them: the terms worth marking in running text. */
const CSS_KEYWORD = /^((inline-)?(block|flex|grid)|inline|flexbox|display|position|gap|order|box-sizing|content-box|border-box|float|clear|flow-root|columns|min-content|max-content|fit-content|aspect-ratio|(flex|grid|justify|align|place|column|anchor|position)-[a-z-]+)$/i;

const plainText = (chunks: Chunks) => {
  const text = Array.isArray(chunks) ? chunks.join('') : chunks;
  return typeof text === 'string' ? text.trim() : '';
};

const SKY_FAMILY = /^(align|grid|inline|place|display|gap|content-box|border-box)/i;

/** Colour follows the family, so terms that appear together (justify/align, flex/grid) contrast. */
const toneClass = (text: string) => (SKY_FAMILY.test(text) ? ' tone-sky' : '');

/** Maps the tags allowed in messages to markup, so catalogs never contain raw HTML. */
export const richTags = {
  b: (chunks: Chunks) => {
    const text = plainText(chunks);
    return <strong className={CSS_KEYWORD.test(text) ? `keyword${toneClass(text)}` : undefined}>{chunks}</strong>;
  },
  brick: (chunks: Chunks) => <span className={`brick${toneClass(plainText(chunks))}`}>{chunks}</span>,
  moss: (chunks: Chunks) => <span className="moss">{chunks}</span>,
  blue: (chunks: Chunks) => <span className="blue">{chunks}</span>,
  code: (chunks: Chunks) => <code>{chunks}</code>,
  p: (chunks: Chunks) => <p>{chunks}</p>,
  h: (chunks: Chunks) => <span className="list-heading">{chunks}</span>,
};

export const stripTags = (message: string) => message.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/** Cuts on a word boundary to fit the length search engines display. */
export function truncate(text: string, max = 158) {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(' ', max - 1))}…`;
}
