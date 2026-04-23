import { Page } from '@playwright/test';

/** Wait for a network request matching a URL pattern to complete */
export async function waitForRequest(page: Page, urlPattern: string | RegExp) {
  return page.waitForResponse(
    (res) => (typeof urlPattern === 'string' ? res.url().includes(urlPattern) : urlPattern.test(res.url())),
    { timeout: 10_000 }
  );
}

/** Dismiss a cookie banner if present (best-effort) */
export async function dismissCookieBanner(page: Page) {
  const btn = page.getByRole('button', { name: /accept|accepter|ok|agree/i });
  if (await btn.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await btn.click();
  }
}

/** Generate a unique email for test isolation */
export function uniqueEmail(prefix = 'test'): string {
  return `${prefix}+${Date.now()}@example.com`;
}

/** Retry an async action up to `attempts` times */
export async function retry<T>(fn: () => Promise<T>, attempts = 3, delay = 500): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error('retry exhausted');
}
