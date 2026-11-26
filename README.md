# CSS Layout Lab

Interactive documentation to learn CSS layouts: block, inline, flexbox, grid and more. Every example is a live playground available in Spanish and English.

## Tech stack

- Next.js 16 (App Router, Server Components, static generation)
- next-intl (server-side translations)
- TypeScript and CSS Modules
- Vitest, Testing Library and jsdom (unit tests)
- Playwright and axe (end-to-end and accessibility tests)
- ESLint and Prettier (lint and formatting)
- GitHub Actions (lint, format, unit and end-to-end tests on `main` and `master`), required by Vercel before production

## Getting started

Requires Node 24.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The proxy redirects `/` to `/es` or `/en` based on the browser language.

## Scripts

| Script                    | What it does                                                |
| ------------------------- | ----------------------------------------------------------- |
| `npm run dev`             | Development server                                          |
| `npm run build`           | Production build                                            |
| `npm start`               | Serves the production build                                 |
| `npm test`                | Runs the unit tests once                                    |
| `npm run test:watch`      | Runs the tests again on every change                        |
| `npm run test:coverage`   | Tests and coverage report; fails below 90 %                 |
| `npm run test:e2e`        | Builds the site and runs the end-to-end tests               |
| `npm run test:e2e:ui`     | Playwright's interface, to run and debug them one by one    |
| `npm run test:e2e:report` | Opens the last end-to-end report                            |
| `npm run lint`            | ESLint (`lint:fix` fixes what it can)                       |
| `npm run format`          | Formats the code with Prettier (`format:check` only checks) |

## Unit tests

The tests use [Vitest](https://vitest.dev) with jsdom and [Testing Library](https://testing-library.com), following the Next.js guide for Vitest. Each test sits next to the file it covers (`css-edit.ts` → `css-edit.test.ts`).

- **Logic**: CSS editing from the selectors, syntax highlighting, rich text and SEO (URLs, hreflang, Open Graph).
- **Content**: every page points to an existing example, every selector option can be applied to its CSS, and both languages have the same message keys.
- **Client components**: playground (selectors, width, reset, full screen), preview, code editor, search, side menu, theme and language switchers and the support panel.

Coverage must stay at **90 % or more** in lines, statements, functions and branches; the thresholds live in `vitest.config.mts`, so `npm run test:coverage` fails below them. The HTML report is written to `coverage/`.

Route files (`page`, `layout`, `route`, sitemap, proxy) and async Server Components are left out of coverage: they cannot be rendered in unit tests and are better covered end to end. `vitest.setup.ts` provides the browser APIs jsdom lacks (`matchMedia`, `ResizeObserver`, `IntersectionObserver`, `scrollIntoView` and modal dialogs).

## End-to-end tests

The tests live in `e2e/` and run against the **production build** (`next build` and `next start`), not the development server.

- **[Playwright](https://playwright.dev)** (`@playwright/test`): test runner and browser automation, configured in `playwright.config.ts`.
- **Chromium**, in two projects: `desktop` (Desktop Chrome) and `mobile` (Pixel 7 emulation, with touch and a narrow viewport).
- **[axe-core](https://github.com/dequelabs/axe-core)** through `@axe-core/playwright`: automated accessibility checks (WCAG) on every page.
- **Playwright fixtures** (`e2e/fixtures.ts`): every test fails on console errors, uncaught exceptions or failed requests to the site.

Playwright builds and starts the site itself on port 4100 (`E2E_PORT` changes it); it never reuses a server already running on that port. The first run needs the browser: `npx playwright install chromium`.

- **Every route** (`routes.spec.ts`): the list comes from the same page registry as the sitemap, in both languages, so a new page is covered on its own; another test checks the served `sitemap.xml` lists exactly those routes. Each page must answer 200 with one visible `h1`, a title, no console errors or failed requests, and no serious or critical [axe](https://github.com/dequelabs/axe-core) accessibility issues (desktop run). Missing pages must be real 404s with the site design, and unknown languages and the root must redirect to a real language.
- **Flows**: the playground (options, editing, width, reset, full screen on desktop), search (accents, Enter, Ctrl+K), header, footer and mobile menu navigation, the support card and Ko-fi link, and the language and theme switches being remembered.

Tests use accessible locators (`getByRole`, `getByLabel`) and texts read from `messages/`, so a copy change does not break them. On failure the HTML report, screenshots and traces are in `playwright-report/` and `test-results/`.

## CI/CD

`.github/workflows/ci-cd.yml` runs on every push and pull request to `main` and `master`:

1. **`checks`**: `npm ci`, `npm run lint`, `npm run format:check` and `npm run test:coverage`. Fails on any lint or formatting error, a failing unit test, or coverage below 90 %, and keeps the coverage report as an artifact.
2. **`e2e`**, only if `checks` passes: installs Chromium and runs `npm run test:e2e`, keeping the Playwright report as an artifact.

Vercel waits for both checks (Deployment Checks) before promoting a deployment to production, so code that fails either of them never goes live.

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
