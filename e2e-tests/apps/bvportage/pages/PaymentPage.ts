/**
 * pages/PaymentPage.ts
 * Gère la page de paiement
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class PaymentPage extends BasePage {
  readonly cardNumberInput = this.page.locator('input[placeholder*="Card"], input[placeholder*="Carte"]');
  readonly cardExpiryInput = this.page.locator('input[placeholder*="MM/YY"], input[placeholder*="Date"]');
  readonly cardCvcInput = this.page.locator('input[placeholder*="CVC"], input[placeholder*="CVV"]');
  readonly cardholderNameInput = this.page.locator('input[placeholder*="Nom"]');
  readonly payButton = this.page.locator('button:has-text("Payer"), button:has-text("Pay")');
  readonly successMessage = this.page.locator('[role="status"], .success, .text-green');
  readonly errorMessage = this.page.locator('[role="alert"], .error, .text-red');
  readonly amountDisplay = this.page.locator('[data-testid="amount"], .amount');

  async fillPaymentForm(cardData: {
    cardNumber: string;
    expiry: string;
    cvc: string;
    cardholderName: string;
  }) {
    await this.cardNumberInput.fill(cardData.cardNumber);
    await this.cardExpiryInput.fill(cardData.expiry);
    await this.cardCvcInput.fill(cardData.cvc);
    await this.cardholderNameInput.fill(cardData.cardholderName);
  }

  async pay() {
    await this.payButton.click();
  }

  async verifyPaymentSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyPaymentError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }
}
