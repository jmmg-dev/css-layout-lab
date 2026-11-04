// Bricks use :where() so any rule written in the playground wins over them.
const BASE_STYLES = `
html { color-scheme: light; }
:root[data-theme="dark"] { color-scheme: dark; }
:root[data-theme="dark"] body { color: #e8eaef; }
body {
  background: transparent;
  color: #1b1e26;
  font: 500 15px/1.4 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 12px;
}
::-webkit-scrollbar { height: 0.25rem; width: 0.25rem; }
::-webkit-scrollbar-thumb { background: #2b7de0; border-radius: 999px; }
@supports not selector(::-webkit-scrollbar) {
  * { scrollbar-color: #2b7de0 transparent; scrollbar-width: thin; }
}
:where(.container > :not(.content), .content > *, .brick) {
  background-color: #ffc9ae;
  border-radius: 6px;
  color: #1b1e26;
  font-weight: 600;
  text-align: center;
}
`;

export const USER_STYLE_ID = 'user-css';

/** Initial preview document. After hydration the iframe is patched in place, never reloaded. */
export const buildPreviewDoc = (html: string, css: string) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_STYLES}</style><style id="${USER_STYLE_ID}">${css}</style></head><body>${html}</body></html>`;
