import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './apps/bvportage-freelance/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report-bvportage-freelance' }],
    ['list'],
    ['json', { outputFile: 'test-results/results-bvportage-freelance.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://dev.bluevalorisportage.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  globalSetup: require.resolve('./apps/bvportage-freelance/fixtures/global-setup.ts'),
  webServer: undefined,
});
