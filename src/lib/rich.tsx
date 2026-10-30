import type { ReactNode } from 'react';

type Chunks = ReactNode;

/** Maps the tags allowed in messages to markup, so catalogs never contain raw HTML. */
export const richTags = {
  b: (chunks: Chunks) => <strong>{chunks}</strong>,
  brick: (chunks: Chunks) => <span className="brick">{chunks}</span>,
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
