import { defineConfig, devices } from '@playwright/test';

// A port of its own, away from the development server on 3000. E2E_PORT changes it.
const PORT = Number(process.env.E2E_PORT ?? 4100);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // The production build, which is what visitors get.
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    // Never reuse a running server: another app on the port would be tested instead.
    // If the port is taken, Playwright stops with an error that says so.
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
