import { test as base } from './base.fixture';
import { AppConfig } from '../config/types';

type AuthFixtures = {
  authenticatedPage: void;
};

/**
 * Fixture that logs in before each test and provides an authenticated session.
 * Usage: import { test } from '../fixtures/auth.fixture';
 */
export const test = base.extend<AuthFixtures & { appConfig: AppConfig }>({
  appConfig: [undefined as unknown as AppConfig, { option: true }],

  authenticatedPage: async ({ page, appConfig }, use) => {
    if (!appConfig?.credentials) throw new Error('appConfig.credentials required for auth fixture');

    await page.goto(`${appConfig.baseURL}/login`);
    await page.getByLabel(/email/i).fill(appConfig.credentials.email);
    await page.getByLabel(/password|mot de passe/i).fill(appConfig.credentials.password);
    await page.getByRole('button', { name: /sign in|login|connexion/i }).click();
    await page.waitForLoadState('networkidle');

    await use();
  },
});

export { expect } from './base.fixture';
