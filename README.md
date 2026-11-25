# CSS Layout Lab

Interactive documentation to learn CSS layouts: block, inline, flexbox, grid and more. Every example is a live playground available in Spanish and English.

## Tech stack

- Next.js 16 (App Router, Server Components, static generation)
- next-intl (server-side translations)
- TypeScript and CSS Modules
- Vitest, Testing Library and jsdom (unit tests)
- ESLint and Prettier (lint and formatting)
- GitHub Actions (lint, format, tests and coverage on `main` and `master`), required by Vercel before production

## Getting started

Requires Node 24.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The proxy redirects `/` to `/es` or `/en` based on the browser language.

## Scripts

| Script                  | What it does                                                |
| ----------------------- | ----------------------------------------------------------- |
| `npm run dev`           | Development server                                          |
| `npm run build`         | Production build                                            |
| `npm start`             | Serves the production build                                 |
| `npm test`              | Runs the unit tests once                                    |
| `npm run test:watch`    | Runs the tests again on every change                        |
| `npm run test:coverage` | Tests and coverage report; fails below 90 %                 |
| `npm run lint`          | ESLint (`lint:fix` fixes what it can)                       |
| `npm run format`        | Formats the code with Prettier (`format:check` only checks) |

## Unit tests

The tests use [Vitest](https://vitest.dev) with jsdom and [Testing Library](https://testing-library.com), following the Next.js guide for Vitest. Each test sits next to the file it covers (`css-edit.ts` → `css-edit.test.ts`).

- **Logic**: CSS editing from the selectors, syntax highlighting, rich text and SEO (URLs, hreflang, Open Graph).
- **Content**: every page points to an existing example, every selector option can be applied to its CSS, and both languages have the same message keys.
- **Client components**: playground (selectors, width, reset, full screen), preview, code editor, search, side menu, theme and language switchers and the support panel.

Coverage must stay at **90 % or more** in lines, statements, functions and branches; the thresholds live in `vitest.config.mts`, so `npm run test:coverage` fails below them. The HTML report is written to `coverage/`.

Route files (`page`, `layout`, `route`, sitemap, proxy) and async Server Components are left out of coverage: they cannot be rendered in unit tests and are better covered end to end. `vitest.setup.ts` provides the browser APIs jsdom lacks (`matchMedia`, `ResizeObserver`, `IntersectionObserver`, `scrollIntoView` and modal dialogs).

## CI/CD

`.github/workflows/ci-cd.yml` runs a `checks` job on every push and pull request to `main` and `master`: `npm ci`, then `npm run lint` and `npm run format:check`, then `npm run test:coverage`. The workflow fails on any lint or formatting error, a failing test, or coverage below 90 %, and keeps the coverage report as an artifact. Vercel waits for that check (Deployment Checks) before promoting a deployment to production, so code that fails it never goes live.

## Configuration

In production, canonical URLs, hreflang tags, the sitemap and the social cards use `https://css-layout-lab.com`; in development, `http://localhost:3000`. `NEXT_PUBLIC_SITE_URL` overrides both.

```bash
NEXT_PUBLIC_SITE_URL=https://example.com
```

## Project structure

- `messages/`: Spanish and English texts. Only tags from `src/lib/rich.tsx` are allowed.
- `src/content/pages.ts`: page registry. It drives routes, navigation, the sitemap and pagination.
- `src/content/examples.ts`: playground code and selectors.
- `src/components/playground/`: the only interactive part of the docs, together with the navigation.

## Adding a page

1. Add its texts to both files in `messages/`.
2. Add the example to `src/content/examples.ts`.
3. Register the page in `src/content/pages.ts`.
4. Run `npm test`: the content tests check that the page, its example, its selectors and its texts in both languages fit together.

## Author

Juan Manuel Muñoz González
