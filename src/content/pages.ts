import type { DocPage, GroupId } from './types';

export const groups: { id: GroupId; path: string }[] = [
  { id: 'fundamentals', path: 'introduction' },
  { id: 'flex', path: 'flex' },
  { id: 'grid', path: 'grid' },
  { id: 'beyond', path: 'container-queries' },
];

const flexTopic = (slug: string, ns: string, items: number, example = slug): DocPage => ({
  path: `flex/${slug}`,
  group: 'flex',
  ns: `flex.${ns}`,
  view: 'topic',
  items,
  example,
});

const gridTopic = (slug: string, ns: string, items: number, example = slug): DocPage => ({
  path: `grid/${slug}`,
  group: 'grid',
  ns: `grid.${ns}`,
  view: 'topic',
  items,
  example,
});

export const pages: DocPage[] = [
  { path: 'introduction', group: 'fundamentals', ns: 'basicConcepts', view: 'introduction' },
  {
    path: 'box-sizing',
    group: 'fundamentals',
    ns: 'fundamentals.boxSizing',
    view: 'topic',
    items: 2,
    example: 'box-sizing',
  },
  { path: 'block-inline', group: 'fundamentals', ns: 'blockInline', view: 'blockInline' },
  {
    path: 'position',
    group: 'fundamentals',
    ns: 'fundamentals.position',
    view: 'topic',
    items: 6,
    example: 'position',
  },

  { path: 'flex', group: 'flex', ns: 'flex', view: 'overview' },
  flexTopic('flex-direction', 'direction', 4),
  flexTopic('flex-wrap', 'wrap', 3),
  {
    path: 'flex/justify-align-row',
    group: 'flex',
    ns: 'flex.justifyAlignRow',
    view: 'topic',
    sections: [
      { ns: 'flex.justifyAlignRow.justify', items: 6 },
      { ns: 'flex.justifyAlignRow.align', items: 5 },
    ],
    example: 'justify-align-row',
  },
  {
    path: 'flex/justify-align-column',
    group: 'flex',
    ns: 'flex.justifyAlignColumn',
    view: 'topic',
    sections: [
      { ns: 'flex.justifyAlignColumn.justify', items: 6 },
      { ns: 'flex.justifyAlignColumn.align', items: 4 },
    ],
    example: 'justify-align-column',
  },
  flexTopic('align-self', 'alignSelf', 6),
  flexTopic('align-content', 'alignContent', 7),
  flexTopic('flex-grow', 'grow', 2),
  flexTopic('flex-shrink', 'shrink', 2),
  flexTopic('flex-basis', 'basis', 2),
  flexTopic('flex-shorthand', 'flexShorthand', 5),
  flexTopic('order', 'order', 2),

  { path: 'grid', group: 'grid', ns: 'grid', view: 'overview' },
  gridTopic('grid-inline-grid', 'basics', 2),
  gridTopic('units', 'units', 5),
  gridTopic('explicit-grid', 'explicit', 3),
  gridTopic('implicit-grid', 'implicit', 3),
  gridTopic('grid-auto-flow', 'autoFlow', 3),
  gridTopic('item-positioning', 'positioning', 2),
  gridTopic('named-lines', 'namedLines', 3),
  gridTopic('grid-template-areas', 'areas', 2),
  gridTopic('overlapping-items', 'overlap', 4),
  gridTopic('functions', 'functions', 4),
  gridTopic('fixed-grid', 'fixed', 2),
  gridTopic('fluid-grid', 'fluid', 2),
  gridTopic('subgrid', 'subgrid', 2),
  gridTopic('container-alignment', 'alignment-container', 8),
  gridTopic('content-alignment', 'alignment-content', 11),
  gridTopic('item-alignment', 'alignment-item', 8),
  gridTopic('responsive', 'responsive', 8),

  {
    path: 'container-queries',
    group: 'beyond',
    ns: 'beyond.containerQueries',
    view: 'topic',
    items: 4,
    example: 'container-queries',
  },
  {
    path: 'logical-properties',
    group: 'beyond',
    ns: 'beyond.logical',
    view: 'topic',
    items: 5,
    example: 'logical-properties',
  },
  { path: 'flex-vs-grid', group: 'beyond', ns: 'beyond.flexVsGrid', view: 'flexVsGrid' },
  {
    path: 'layout-recipes',
    group: 'beyond',
    ns: 'beyond.recipes',
    view: 'topic',
    items: 5,
    example: 'layout-recipes',
  },
];

export const getPage = (path: string) => pages.find((page) => page.path === path);

export const getGroupPages = (group: GroupId) => pages.filter((page) => page.group === group);

export function getSiblings(path: string) {
  const index = pages.findIndex((page) => page.path === path);
  return { previous: pages[index - 1], next: pages[index + 1] };
}

/** Position of a page inside its group, used for the numbered navigation. */
export function getPageNumber(page: DocPage) {
  return getGroupPages(page.group).indexOf(page) + 1;
}
