import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  // Vite resolves the tsconfig aliases (@/*) itself.
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        // Types and configuration.
        'src/content/types.ts',
        'src/i18n/**',
        // Route files only compose components: covered better end to end.
        'src/app/**',
        'src/proxy.ts',
        // Async server components cannot be rendered in unit tests (see the Next.js testing guide).
        'src/components/docs/*View.tsx',
        'src/components/docs/DocFrame.tsx',
        'src/components/home/HomePage.tsx',
        'src/components/home/AboutMe.tsx',
        'src/components/home/SupportSection.tsx',
        'src/components/layout/SiteHeader.tsx',
        'src/components/layout/SiteFooter.tsx',
        'src/components/layout/SiteMenu.tsx',
      ],
      thresholds: { lines: 90, statements: 90, functions: 90, branches: 90 },
    },
  },
});
