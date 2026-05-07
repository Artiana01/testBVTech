/**
 * pages/PackPage.ts
 * Gère la sélection et souscription aux packs
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class PackPage extends BasePage {
  readonly agencyPackButton = this.page.locator('button:has-text("Agency"), button[data-pack="agency"]');
  readonly freelancePackButton = this.page.locator('button:has-text("Freelance"), button[data-pack="freelance"]');
  readonly subscribeButton = this.page.locator('button:has-text("S\'abonner"), button:has-text("Subscribe"), button:has-text("Souscrire")');
  readonly priceText = this.page.locator('text="159"');
  readonly successMessage = this.page.locator('[role="status"], .success, .text-green');

  async selectAgencyPack() {
    await this.agencyPackButton.click();
  }

  async selectFreelancePack() {
    await this.freelancePackButton.click();
  }

  async subscribe() {
    await this.subscribeButton.click();
  }

  async verifyPackPrice(price: string) {
    await expect(this.page.locator(`text="${price}"`)).toBeVisible();
  }

  async verifySubscriptionSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }
}
