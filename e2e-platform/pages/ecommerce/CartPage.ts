import { Page, expect } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/cart');
    await this.waitForPageLoad();
  }

  async open() {
    const cartIcon = this.page.getByRole('link', { name: /cart|panier/i })
      .or(this.page.getByTestId('cart-icon'));
    await cartIcon.click();
  }

  async assertItemCount(count: number) {
    const badge = this.page.getByTestId('cart-count')
      .or(this.page.locator('[data-cart-count]'));
    await expect(badge).toHaveText(String(count));
  }

  async assertItemInCart(productName: string) {
    await expect(this.page.getByText(productName)).toBeVisible();
  }

  async removeItem(productName: string) {
    const row = this.page.locator('tr, [data-testid="cart-item"]').filter({ hasText: productName });
    await row.getByRole('button', { name: /remove|supprimer/i }).click();
  }

  async updateQuantity(productName: string, qty: number) {
    const row = this.page.locator('tr, [data-testid="cart-item"]').filter({ hasText: productName });
    await row.getByRole('spinbutton').fill(String(qty));
    await row.getByRole('spinbutton').press('Enter');
  }

  async proceedToCheckout() {
    await this.page.getByRole('link', { name: /checkout|commander/i }).click();
    await this.waitForPageLoad();
  }

  async assertEmpty() {
    await expect(
      this.page.getByText(/empty|vide|no items/i)
    ).toBeVisible();
  }
}
