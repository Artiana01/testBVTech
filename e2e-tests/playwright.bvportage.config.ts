/**
 * playwright.bvportage.config.ts
 * Configuration Playwright spécifique pour BV Portage
 */
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './apps/bvportage/tests',
  
  timeout: 60_000,
  
  expect: {
    timeout: 5_000,
  },

  fullyParallel: false,
  retries: 0,
  workers: 1,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report-bvportage', open: 'never' }],
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

  globalSetup: require.resolve('./apps/bvportage/global-setup'),

  webServer: undefined,
});
