import { Page, expect } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/');
    await this.waitForPageLoad();
  }

  async assertHeroVisible() {
    await expect(
      this.page.getByRole('banner').or(this.page.locator('section').first())
    ).toBeVisible();
  }

  async assertCTAVisible() {
    const cta = this.page.getByRole('link', { name: /get started|contact|en savoir plus|découvrir/i });
    await expect(cta.first()).toBeVisible();
  }

  async clickCTA() {
    await this.page.getByRole('link', { name: /get started|contact|en savoir plus|découvrir/i }).first().click();
    await this.waitForPageLoad();
  }

  async assertSectionVisible(heading: string) {
    await expect(
      this.page.getByRole('heading', { name: heading })
    ).toBeVisible();
  }
}
