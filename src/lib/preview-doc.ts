// Bricks use :where() so any rule written in the playground wins over them.
const BASE_STYLES = `
html { color-scheme: dark; }
body {
  background: transparent;
  color: #f5f2eb;
  font: 500 15px/1.4 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 12px;
}
:where(.container > :not(.content), .content > *, .brick) {
  background-color: #b45309;
  background-image: linear-gradient(#bb6c30 1px, transparent 1px), linear-gradient(#a74d08 2px, transparent 2px);
  background-position: 0 0, 10px 10px;
  background-size: 20px 20px;
  border-radius: 2px;
  color: #f5f2eb;
  font-weight: 600;
  text-align: center;
}
`;

export const USER_STYLE_ID = 'user-css';

/** Initial preview document. After hydration the iframe is patched in place, never reloaded. */
export const buildPreviewDoc = (html: string, css: string) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_STYLES}</style><style id="${USER_STYLE_ID}">${css}</style></head><body>${html}</body></html>`;
