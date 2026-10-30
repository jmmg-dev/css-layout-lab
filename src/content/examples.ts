import type { Example } from './types';

const BORDER = 'border: 1px solid #0077aa;';

const children = (count: number, tag = 'div', className = 'child') =>
  Array.from({ length: count }, (_, i) => `  <${tag} class="${className}">${i + 1}</${tag}>`).join('\n');

const numberedChildren = (count: number, tag = 'div') =>
  Array.from({ length: count }, (_, i) => `  <${tag} class="child-${i + 1}">${i + 1}</${tag}>`).join('\n');

const container = (inner: string) => `<div class="container">\n${inner}\n</div>`;

const childRule = `.child {\n  padding: 1rem;\n}`;

const gridCss = (declarations: string[], extra = childRule) =>
  `.container {\n  ${BORDER}\n${declarations.map((d) => `  ${d}`).join('\n')}\n  padding: 0.5rem;\n}\n\n${extra}`;

const flexCss = (declarations: string[], extra = childRule) =>
  gridCss(['display: flex;', 'gap: 1rem;', ...declarations], extra);

const paddedChildren = `.child-1 {\n  padding: 0.5rem;\n}\n\n.child-2 {\n  padding: 1rem;\n}\n\n.child-3 {\n  padding: 2rem;\n}`;

const FLEX_JUSTIFY = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'];
const FLEX_ALIGN = ['stretch', 'flex-start', 'center', 'flex-end'];
const GRID_ALIGN = ['stretch', 'start', 'center', 'end'];
const GRID_CONTENT = [...GRID_ALIGN, 'space-around', 'space-between', 'space-evenly'];

const flexItems = (rule: (n: number) => string) =>
  [1, 2, 3].map((n) => `.child-${n} {\n  ${rule(n)}\n  padding: 1rem;\n}`).join('\n\n');

const explicitBase = {
  html: container(children(6)),
  css: gridCss(['display: grid;', 'gap: 1rem;', 'grid-template-columns: 20% 1fr 2fr;', 'grid-template-rows: 4rem;']),
};

const seventhChild = `  <div style="grid-column: 4" class="child">\n    7\n  </div>`;

const positioningCss = (rule: string) =>
  gridCss(['display: grid;', 'gap: 1rem;', 'grid-template-columns: repeat(3, 1fr);'], `.positioning {\n${rule}\n}\n\n${childRule}`);

const responsiveHtml = container(children(6));

const flexVsGridHtml = container(children(5));

export const examples: Record<string, Example> = {
  brick: {
    height: 210,
    html: `<div class="brick">\n  Hello world!\n</div>`,
    css: `.brick {
  background-color: #b45309;
  background-image: linear-gradient(
      #bb6c30 1px,
      transparent 1px
    ),
    linear-gradient(#a74d08 2px, transparent 2px);
  background-position:
    0 0,
    10px 10px;
  background-size: 20px 20px;
  border-radius: 2px;
  color: #f5f2eb;
  font-weight: 600;
  padding: 3rem;
  text-align: center;
}`,
  },

  block: {
    height: 250,
    html: container(children(3)),
    css: `.container {\n  ${BORDER}\n  padding: 0.5rem;\n}\n\n.child {\n  display: block;\n  margin: 0.5rem;\n  padding: 1rem;\n}`,
  },
  inline: {
    height: 110,
    html: container(children(3, 'span')),
    css: `.container {\n  ${BORDER}\n  padding: 0.5rem;\n}\n\n.child {\n  display: inline;\n  margin-right: 1rem;\n  padding: 0.5rem;\n}`,
  },
  'inline-block': {
    height: 130,
    html: container(children(3, 'span')),
    css: `.container {\n  ${BORDER}\n  padding: 0.5rem;\n}\n\n.child {\n  display: inline-block;\n  margin: 0.5rem;\n  padding: 1rem;\n  width: 2rem;\n}`,
  },

  'box-sizing': {
    height: 240,
    html: container(`  <div class="child">reference</div>\n  <div class="child item">item</div>`),
    css: `.container {
  ${BORDER}
  padding: 0.5rem;
}

.child {
  border: 6px solid #f5f2eb;
  margin-bottom: 0.75rem;
  padding: 1.5rem;
  width: 14rem;
}

.item {
  box-sizing: content-box;
}`,
    controls: [
      {
        kind: 'property',
        labelKey: 'fundamentals.boxSizing.select',
        selector: '.item',
        property: 'box-sizing',
        options: ['content-box', 'border-box'],
      },
    ],
  },

  position: {
    height: 290,
    html: container(`  <div class="child">1</div>
  <div class="child item">2</div>
  <div class="child">3</div>
  <div class="child">4</div>
  <div class="child">5</div>
  <div class="child">6</div>`),
    css: `.container {
  ${BORDER}
  height: 15rem;
  overflow: auto;
  padding: 0.5rem;
  position: relative;
}

.child {
  margin-bottom: 0.5rem;
  padding: 1rem;
}

.item {
  background: #6f8f72;
  left: 2rem;
  position: relative;
  top: 1rem;
  width: 60%;
  z-index: 1;
}`,
    controls: [
      {
        kind: 'property',
        labelKey: 'fundamentals.position.select',
        selector: '.item',
        property: 'position',
        options: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
      },
    ],
  },

  'flex-direction': {
    height: 110,
    html: container(children(3)),
    css: flexCss(['flex-direction: row;']),
    controls: [
      {
        kind: 'property',
        labelKey: 'flex.direction.select',
        selector: '.container',
        property: 'flex-direction',
        options: ['row', 'row-reverse', 'column', 'column-reverse'],
      },
    ],
  },
  'flex-wrap': {
    height: 130,
    html: container(children(5)),
    css: flexCss(['flex-wrap: nowrap;', 'max-width: 10rem;']),
    controls: [
      {
        kind: 'property',
        labelKey: 'flex.wrap.select',
        selector: '.container',
        property: 'flex-wrap',
        options: ['nowrap', 'wrap', 'wrap-reverse'],
      },
    ],
  },
  'justify-align-row': {
    height: 150,
    html: container(numberedChildren(3, 'span')),
    css: flexCss(['align-items: stretch;', 'height: 6rem;', 'justify-content: flex-start;'], paddedChildren),
    controls: [
      {
        kind: 'property',
        labelKey: 'flex.justifyAlignRow.justify.select',
        selector: '.container',
        property: 'justify-content',
        options: FLEX_JUSTIFY,
      },
      {
        kind: 'property',
        labelKey: 'flex.justifyAlignRow.align.select',
        selector: '.container',
        property: 'align-items',
        options: [...FLEX_ALIGN, 'baseline'],
      },
    ],
  },
  'justify-align-column': {
    height: 290,
    html: container(numberedChildren(3, 'span')),
    css: flexCss(
      ['align-items: stretch;', 'flex-direction: column;', 'height: 15rem;', 'justify-content: flex-start;'],
      paddedChildren,
    ),
    controls: [
      {
        kind: 'property',
        labelKey: 'flex.justifyAlignColumn.justify.select',
        selector: '.container',
        property: 'justify-content',
        options: FLEX_JUSTIFY,
      },
      {
        kind: 'property',
        labelKey: 'flex.justifyAlignColumn.align.select',
        selector: '.container',
        property: 'align-items',
        options: FLEX_ALIGN,
      },
    ],
  },
  'align-self': {
    height: 205,
    html: container(`  <div class="child">1</div>\n  <div class="child item">2</div>\n  <div class="child">3</div>`),
    css: flexCss(['align-items: flex-start;', 'height: 10rem;'], `${childRule}\n\n.item {\n  align-self: auto;\n}`),
    controls: [
      {
        kind: 'property',
        labelKey: 'flex.alignSelf.select',
        selector: '.item',
        property: 'align-self',
        options: ['auto', 'flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
      },
    ],
  },
  'align-content': {
    height: 310,
    html: container(children(6)),
    css: flexCss(['align-content: stretch;', 'flex-wrap: wrap;', 'height: 16rem;', 'max-width: 16rem;']),
    controls: [
      {
        kind: 'property',
        labelKey: 'flex.alignContent.select',
        selector: '.container',
        property: 'align-content',
        options: [...FLEX_ALIGN, 'space-between', 'space-around', 'space-evenly'],
      },
    ],
  },
  'flex-grow': {
    height: 110,
    html: container(numberedChildren(3, 'span')),
    css: flexCss([], flexItems((n) => `flex-grow: ${n - 1};`)),
  },
  'flex-shrink': {
    height: 170,
    html: container(
      [1, 2, 3].map((n) => `  <span class="child-${n}">This is an example</span>`).join('\n'),
    ),
    css: flexCss(['max-width: 20rem;'], flexItems((n) => `flex-shrink: ${n === 1 ? 0 : 1};`)),
  },
  'flex-basis': {
    height: 110,
    html: container(numberedChildren(3, 'span')),
    css: flexCss([], flexItems((n) => `flex-basis: ${['auto', '90px', '12rem'][n - 1]};`)),
  },
  'flex-shorthand': {
    height: 110,
    html: container(`  <div class="child">1</div>\n  <div class="child item">2</div>\n  <div class="child">3</div>`),
    css: flexCss([], `${childRule}\n\n.item {\n  flex: initial;\n}`),
    controls: [
      {
        kind: 'property',
        labelKey: 'flex.flexShorthand.select',
        selector: '.item',
        property: 'flex',
        options: ['initial', 'auto', '1', 'none', '0 0 12rem'],
      },
    ],
  },
  order: {
    height: 110,
    html: container(numberedChildren(3)),
    css: flexCss([], flexItems((n) => `order: ${[3, 1, 2][n - 1]};`)),
  },

  'grid-inline-grid': {
    height: 240,
    html: container(children(6)),
    css: gridCss(['display: grid;', 'gap: 1rem;', 'grid-template-columns: 1fr 2fr 1fr;']),
    controls: [
      {
        kind: 'property',
        labelKey: 'grid.basics.select',
        selector: '.container',
        property: 'display',
        options: ['grid', 'inline-grid'],
      },
    ],
  },
  units: {
    height: 200,
    html: container(`  <div class="child">1fr</div>
  <div class="child">20%</div>
  <div class="child">auto</div>
  <div class="child">min-content</div>
  <div class="child">max-content</div>
  <div class="child span">span</div>`),
    css: gridCss(
      ['display: grid;', 'gap: 1rem;', 'grid-template-columns: 1fr 20% auto min-content max-content;'],
      `.span {\n  grid-column: span 2;\n}\n\n${childRule}`,
    ),
  },
  'explicit-grid': {
    height: 240,
    ...explicitBase,
    controls: [
      {
        kind: 'preset',
        labelKey: 'grid.explicit.select',
        options: [
          { value: 'example row', ...explicitBase },
          {
            value: 'example column',
            html: container(`${children(6)}\n${seventhChild}`),
            css: explicitBase.css,
          },
        ],
      },
    ],
  },
  'implicit-grid': {
    height: 240,
    html: container(children(6)),
    css: gridCss([
      'display: grid;',
      'gap: 1rem;',
      'grid-auto-rows: 5rem;',
      'grid-template-columns: 20% 1fr 2fr;',
      'grid-template-rows: 4rem;',
    ]),
    controls: [
      {
        kind: 'preset',
        labelKey: 'grid.implicit.select',
        options: [
          {
            value: 'rows',
            html: container(children(6)),
            css: gridCss([
              'display: grid;',
              'gap: 1rem;',
              'grid-auto-rows: 5rem;',
              'grid-template-columns: 20% 1fr 2fr;',
              'grid-template-rows: 4rem;',
            ]),
          },
          {
            value: 'columns',
            html: container(`${children(6)}\n${seventhChild}`),
            css: gridCss([
              'display: grid;',
              'gap: 1rem;',
              'grid-auto-columns: 5rem;',
              'grid-template-columns: 20% 1fr 2fr;',
            ]),
          },
        ],
      },
    ],
  },
  'grid-auto-flow': {
    height: 305,
    html: container(`  <div class="child-big">1</div>
  <div class="child">2</div>
  <div class="child-big">3</div>
  <div class="child">4</div>`),
    css: gridCss(
      ['display: grid;', 'gap: 1rem;', 'grid-auto-flow: row;'],
      `${childRule}\n\n.child-big {\n  grid-column: span 2;\n  padding: 1rem;\n}`,
    ),
    controls: [
      {
        kind: 'property',
        labelKey: 'grid.autoFlow.select',
        selector: '.container',
        property: 'grid-auto-flow',
        options: ['row', 'column', 'dense'],
      },
    ],
  },
  'item-positioning': {
    height: 235,
    html: container(`  <div class="child">1</div>
  <div class="child">2</div>
  <div class="child positioning">3</div>
  <div class="child">4</div>`),
    css: positioningCss(
      `  grid-column: 1 / 3; /* grid-column: col-start / col-end */\n  grid-row: 1 / 3; /* grid-row: row-start / row-end */`,
    ),
    controls: [
      {
        kind: 'preset',
        labelKey: 'grid.positioning.select',
        options: [
          {
            value: 'grid-column / grid-row',
            html: container(`  <div class="child">1</div>
  <div class="child">2</div>
  <div class="child positioning">3</div>
  <div class="child">4</div>`),
            css: positioningCss(
              `  grid-column: 1 / 3; /* grid-column: col-start / col-end */\n  grid-row: 1 / 3; /* grid-row: row-start / row-end */`,
            ),
          },
          {
            value: 'grid-area',
            html: container(`  <div class="child">1</div>
  <div class="child">2</div>
  <div class="child positioning">3</div>
  <div class="child">4</div>`),
            css: positioningCss(
              `  grid-area: 1 / 3 / 3 / 3;\n  /* grid-area: row-start / col-start / row-end / col-end */`,
            ),
          },
        ],
      },
    ],
  },
  'named-lines': {
    height: 230,
    html: container(`  <div class="child item">item</div>
  <div class="child">1</div>
  <div class="child">2</div>`),
    css: gridCss(
      [
        'display: grid;',
        'gap: 1rem;',
        'grid-template-columns:',
        '  [full-start sidebar-start] 8rem',
        '  [sidebar-end main-start] 1fr',
        '  [main-end full-end];',
      ],
      `.item {\n  background: #6f8f72;\n  grid-column: main-start / main-end;\n}\n\n${childRule}`,
    ),
    controls: [
      {
        kind: 'property',
        labelKey: 'grid.namedLines.select',
        selector: '.item',
        property: 'grid-column',
        options: ['sidebar-start / sidebar-end', 'main-start / main-end', 'full-start / full-end'],
      },
    ],
  },
  'grid-template-areas': {
    height: 240,
    html: container(`  <div class="header">header</div>
  <div class="body-left">left</div>
  <div class="body-center">center</div>
  <div class="body-right">right</div>
  <div class="footer">footer</div>`),
    css: `.container {
  ${BORDER}
  display: grid;
  gap: 1rem;
  grid-template-areas:
    "header header header"
    "body-left body-center body-right"
    "footer footer footer";
  grid-template-columns: 75px 1fr 75px;
  grid-template-rows: 2fr 4rem 1fr;
  height: 12rem;
  padding: 0.5rem;
}

.header {
  grid-area: header;
}

.body-left {
  grid-area: body-left;
}

.body-center {
  grid-area: body-center;
}

.body-right {
  grid-area: body-right;
}

.footer {
  grid-area: footer;
}`,
  },
  'overlapping-items': {
    height: 240,
    html: container(`  <div class="child item">item</div>\n  <div class="child other">other</div>`),
    css: gridCss(
      ['display: grid;', 'grid-template-columns: repeat(3, 1fr);', 'grid-template-rows: repeat(3, 4rem);'],
      `.child {\n  padding: 1rem;\n}\n\n.item {\n  background: #6f8f72;\n  grid-area: 1 / 1 / 3 / 3;\n  z-index: 0;\n}\n\n.other {\n  grid-area: 2 / 2 / 4 / 4;\n  z-index: 1;\n}`,
    ),
    controls: [
      {
        kind: 'property',
        labelKey: 'grid.overlap.select',
        selector: '.item',
        property: 'z-index',
        options: ['0', '1', '2'],
      },
    ],
  },
  functions: {
    height: 230,
    html: container(children(6)),
    css: gridCss([
      'display: grid;',
      'gap: 1rem;',
      'grid-auto-rows: minmax(50px, auto);',
      'grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));',
    ]),
  },
  'fixed-grid': {
    height: 215,
    html: container(children(6)),
    css: gridCss([
      'column-gap: 0.5rem;',
      'display: grid;',
      'grid-template-columns: 100px 4rem 50px;',
      'grid-template-rows: 60px 6rem;',
      'row-gap: 1rem;',
    ]),
  },
  'fluid-grid': {
    height: 170,
    html: container(children(6)),
    css: gridCss(['display: grid;', 'gap: 1rem;', 'grid-template-columns: 50% 1fr 2fr;']),
  },
  subgrid: {
    height: 305,
    html: container(`  <div class="child">1</div>
  <div class="child">2</div>
  <div class="child">3</div>
  <div class="content">
    <div class="child">4</div>
    <div class="child">5</div>
  </div>
  <div class="child">6</div>`),
    css: gridCss(
      ['display: grid;', 'gap: 1rem;', 'grid-template-columns: 1fr 2fr;'],
      `.content {\n  display: grid;\n  gap: 0.5rem;\n  grid-column: 1 / -1;\n  grid-template-columns: subgrid;\n}\n\n${childRule}`,
    ),
  },
  'container-alignment': {
    height: 240,
    html: container(`  <div class="child">1</div>
  <div class="child-big">2</div>
  <div class="child">3</div>
  <div class="child">4</div>
  <div class="child-big">5</div>
  <div class="child">6</div>`),
    css: gridCss(
      [
        'align-items: stretch;',
        'display: grid;',
        'gap: 1rem;',
        'grid-template-columns: auto auto auto;',
        'justify-items: stretch;',
      ],
      `.child-big {\n  padding: 2rem;\n}\n\n${childRule}`,
    ),
    controls: [
      {
        kind: 'property',
        labelKey: 'grid.alignment-container.selectJustify',
        selector: '.container',
        property: 'justify-items',
        options: GRID_ALIGN,
      },
      {
        kind: 'property',
        labelKey: 'grid.alignment-container.selectAlign',
        selector: '.container',
        property: 'align-items',
        options: GRID_ALIGN,
      },
    ],
  },
  'content-alignment': {
    height: 200,
    html: container(children(6)),
    css: gridCss([
      'align-content: stretch;',
      'display: grid;',
      'gap: 1rem;',
      'grid-template-columns: auto auto auto;',
      'height: 150px;',
      'justify-content: stretch;',
    ]),
    controls: [
      {
        kind: 'property',
        labelKey: 'grid.alignment-content.selectJustify',
        selector: '.container',
        property: 'justify-content',
        options: GRID_CONTENT,
      },
      {
        kind: 'property',
        labelKey: 'grid.alignment-content.selectAlign',
        selector: '.container',
        property: 'align-content',
        options: GRID_CONTENT,
      },
    ],
  },
  'item-alignment': {
    height: 150,
    html: container(`  <div class="child">1</div>\n  <div class="child item">2</div>\n  <div class="child">3</div>`),
    css: gridCss(
      ['display: grid;', 'gap: 1rem;', 'grid-template-columns: auto auto auto;', 'grid-template-rows: 6rem;', 'height: 6rem;'],
      `.item {\n  align-self: stretch;\n  justify-self: stretch;\n}\n\n${childRule}`,
    ),
    controls: [
      {
        kind: 'property',
        labelKey: 'grid.alignment-item.selectJustify',
        selector: '.item',
        property: 'justify-self',
        options: GRID_ALIGN,
      },
      {
        kind: 'property',
        labelKey: 'grid.alignment-item.selectAlign',
        selector: '.item',
        property: 'align-self',
        options: GRID_ALIGN,
      },
    ],
  },
  responsive: {
    height: 260,
    html: responsiveHtml,
    css: gridCss(['display: grid;', 'gap: 1rem;', 'grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));']),
    controls: [
      {
        kind: 'preset',
        labelKey: 'grid.responsive.select',
        options: [
          {
            value: 'auto-fit',
            html: responsiveHtml,
            css: gridCss(['display: grid;', 'gap: 1rem;', 'grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));']),
          },
          {
            value: 'media queries',
            html: responsiveHtml,
            css: gridCss(
              ['display: grid;', 'gap: 1rem;', 'grid-template-columns: 1fr;'],
              `${childRule}\n\n@media (min-width: 600px) {\n  .container {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}`,
            ),
          },
          {
            value: 'grid-template-areas',
            html: container(`  <div class="header">header</div>
  <div class="main">main</div>
  <div class="aside">aside</div>
  <div class="footer">footer</div>`),
            css: `.container {
  ${BORDER}
  display: grid;
  gap: 1rem;
  grid-template-areas:
    "header"
    "main"
    "aside"
    "footer";
  padding: 0.5rem;
}

.header { grid-area: header; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }

@media (min-width: 600px) {
  .container {
    grid-template-areas:
      "header header"
      "main aside"
      "footer footer";
    grid-template-columns: 2fr 1fr;
  }
}`,
          },
        ],
      },
    ],
  },

  'container-queries': {
    height: 230,
    html: container(`  <div class="content">
    <div class="child">media</div>
    <div class="child">text</div>
  </div>`),
    css: `.container {
  ${BORDER}
  container-type: inline-size;
  padding: 0.5rem;
}

.content {
  display: grid;
  gap: 1rem;
}

.child {
  padding: 1.5rem;
}

@container (min-width: 28rem) {
  .content {
    grid-template-columns: 1fr 2fr;
  }
}`,
  },
  'logical-properties': {
    height: 270,
    html: container(`  <div class="child item">1</div>\n  <div class="child item">2</div>`),
    css: `.container {
  ${BORDER}
  block-size: 13rem;
  direction: ltr;
  padding: 0.5rem;
  writing-mode: horizontal-tb;
}

.item {
  inline-size: fit-content;
  margin-block-end: 0.5rem;
  margin-inline-start: 4rem;
  padding-block: 1rem;
  padding-inline: 2rem;
}`,
    controls: [
      {
        kind: 'property',
        labelKey: 'beyond.logical.selectDirection',
        selector: '.container',
        property: 'direction',
        options: ['ltr', 'rtl'],
      },
      {
        kind: 'property',
        labelKey: 'beyond.logical.selectWriting',
        selector: '.container',
        property: 'writing-mode',
        options: ['horizontal-tb', 'vertical-rl', 'vertical-lr'],
      },
    ],
  },
  'flex-vs-grid': {
    height: 200,
    html: flexVsGridHtml,
    css: flexCss(['flex-wrap: wrap;'], `.child {\n  flex: 1 1 12rem;\n  padding: 1rem;\n}`),
    controls: [
      {
        kind: 'preset',
        labelKey: 'beyond.flexVsGrid.select',
        options: [
          {
            value: 'flex',
            html: flexVsGridHtml,
            css: flexCss(['flex-wrap: wrap;'], `.child {\n  flex: 1 1 12rem;\n  padding: 1rem;\n}`),
          },
          {
            value: 'grid',
            html: flexVsGridHtml,
            css: gridCss(['display: grid;', 'gap: 1rem;', 'grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));']),
          },
        ],
      },
    ],
  },
  'layout-recipes': {
    height: 300,
    html: container(`  <div class="child">centered</div>`),
    css: gridCss(['display: grid;', 'height: 16rem;', 'place-items: center;']),
    controls: [
      {
        kind: 'preset',
        labelKey: 'beyond.recipes.select',
        options: [
          {
            value: 'center',
            html: container(`  <div class="child">centered</div>`),
            css: gridCss(['display: grid;', 'height: 16rem;', 'place-items: center;']),
          },
          {
            value: 'holy grail',
            html: container(`  <header>header</header>
  <nav>nav</nav>
  <main>main</main>
  <aside>aside</aside>
  <footer>footer</footer>`),
            css: `.container {
  ${BORDER}
  display: grid;
  gap: 0.5rem;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  grid-template-columns: 6rem 1fr 6rem;
  grid-template-rows: auto 1fr auto;
  height: 16rem;
  padding: 0.5rem;
}

header { grid-area: header; }
nav { grid-area: nav; }
main { grid-area: main; }
aside { grid-area: aside; }
footer { grid-area: footer; }

.container > * {
  padding: 0.75rem;
}`,
          },
          {
            value: 'sidebar',
            html: container(`  <aside>sidebar</aside>\n  <main>main</main>`),
            css: `.container {
  ${BORDER}
  display: grid;
  gap: 1rem;
  grid-template-columns: 12rem 1fr;
  height: 16rem;
  padding: 0.5rem;
}

.container > * {
  padding: 1rem;
}`,
          },
          {
            value: 'sticky footer',
            html: container(`  <main>main</main>\n  <footer>footer</footer>`),
            css: `.container {
  ${BORDER}
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 16rem;
  padding: 0.5rem;
}

main {
  flex: 1;
  padding: 1rem;
}

footer {
  padding: 1rem;
}`,
          },
          {
            value: 'card grid',
            html: container(children(5)),
            css: gridCss(
              ['display: grid;', 'gap: 1rem;', 'grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr));'],
              `.child {\n  min-height: 4rem;\n  padding: 1rem;\n}`,
            ),
          },
        ],
      },
    ],
  },
};
