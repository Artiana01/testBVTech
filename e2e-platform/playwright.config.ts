import { defineConfig, devices } from '@playwright/test';
import { apps } from './apps';
import 'dotenv/config';

const ENV = process.env.TEST_ENV || 'dev';
const CI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: CI,                          // fail if test.only left in CI
  retries: CI ? 2 : 0,                     // retry flaky tests in CI only
  workers: CI ? 4 : undefined,             // cap workers in CI

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: CI ? 'never' : 'on-failure' }],
    ['list'],
    ...(CI ? [['github'] as ['github']] : []),
  ],

  use: {
    trace: 'on-first-retry',               // capture trace on first retry
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: CI ? true : false,
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  outputDir: 'test-results',

  // One Playwright "project" per app × browser combination
  projects: [
    // ── E-commerce ────────────────────────────────────────────────
    {
      name: 'shop1-chromium',
      testMatch: '**/ecommerce/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: apps.shop1.baseURL,
      },
    },
    {
      name: 'shop1-mobile',
      testMatch: '**/ecommerce/**/*.spec.ts',
      use: {
        ...devices['Pixel 7'],
        baseURL: apps.shop1.baseURL,
      },
    },
    // ── SaaS ──────────────────────────────────────────────────────
    {
      name: 'saas1-chromium',
      testMatch: '**/saas/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: apps.saas1.baseURL,
      },
    },
    {
      name: 'saas1-firefox',
      testMatch: '**/saas/**/*.spec.ts',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: apps.saas1.baseURL,
      },
    },
    // ── Vitrine ───────────────────────────────────────────────────
    {
      name: 'vitrine1-chromium',
      testMatch: '**/vitrine/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: apps.vitrine1.baseURL,
      },
    },
    {
      name: 'vitrine1-mobile',
      testMatch: '**/vitrine/**/*.spec.ts',
      use: {
        ...devices['iPhone 14'],
        baseURL: apps.vitrine1.baseURL,
      },
    },
  ],
});
