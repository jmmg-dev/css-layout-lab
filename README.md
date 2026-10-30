# CSS Layout Lab

Interactive documentation to learn CSS layouts: block, inline, flexbox, grid and more. Every example is a live playground available in Spanish and English.

## Tech stack

- Next.js 16 (App Router, Server Components, static generation)
- next-intl (server-side translations)
- TypeScript and CSS Modules

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The proxy redirects `/` to `/es` or `/en` based on the browser language.

## Configuration

Canonical URLs, hreflang tags and the sitemap use `NEXT_PUBLIC_SITE_URL`. On Vercel it falls back to the production domain.

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

## Author

Juan Manuel Muñoz González
