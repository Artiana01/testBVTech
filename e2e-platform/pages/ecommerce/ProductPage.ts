import { Page, expect } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(slug = '/products') {
    await super.goto(slug);
    await this.waitForPageLoad();
  }

  async openProduct(name: string) {
    await this.page.getByRole('link', { name }).first().click();
    await this.waitForPageLoad();
  }

  async selectVariant(variant: string) {
    await this.page.getByRole('button', { name: variant }).click();
  }

  async addToCart() {
    await this.page.getByRole('button', { name: /add to cart|ajouter au panier/i }).click();
  }

  async assertAddedToCart() {
    const toast = this.page.getByRole('status').or(this.page.getByRole('alert'));
    await expect(toast).toBeVisible();
  }

  async assertOutOfStock() {
    await expect(
      this.page.getByRole('button', { name: /add to cart|ajouter au panier/i })
    ).toBeDisabled();
  }
}
