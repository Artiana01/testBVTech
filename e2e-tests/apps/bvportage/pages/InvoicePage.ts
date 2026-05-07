/**
 * pages/InvoicePage.ts
 * Gère la création et envoi des factures
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class InvoicePage extends BasePage {
  readonly generateInvoiceButton = this.page.locator('button:has-text("Générer facture"), button:has-text("Generate Invoice")');
  readonly missionSelect = this.page.locator('select[name="mission"], div[role="combobox"]');
  readonly amountInput = this.page.locator('input[type="number"], input[placeholder*="Montant"]');
  readonly descriptionTextarea = this.page.locator('textarea[placeholder*="Description"]');
  readonly createInvoiceButton = this.page.locator('button:has-text("Créer"), button:has-text("Create Invoice")');
  readonly sendButton = this.page.locator('button:has-text("Envoyer"), button:has-text("Send")');
  readonly paymentLinkButton = this.page.locator('button:has-text("Lien de paiement"), button:has-text("Payment Link")');
  readonly copyLinkButton = this.page.locator('button:has-text("Copier"), button:has-text("Copy")');
  readonly successMessage = this.page.locator('[role="status"], .success, .text-green');
  readonly invoiceList = this.page.locator('[data-testid="invoice-list"], .invoice-item');

  async selectMission(missionName: string) {
    await this.missionSelect.click();
    await this.page.locator(`text="${missionName}"`).click();
  }

  async fillInvoiceDetails(amount: string, description?: string) {
    await this.amountInput.fill(amount);
    if (description) {
      await this.descriptionTextarea.fill(description);
    }
  }

  async createInvoice() {
    await this.createInvoiceButton.click();
  }

  async sendInvoice() {
    await this.sendButton.click();
  }

  async getPaymentLink(): Promise<string | null> {
    await this.paymentLinkButton.click();
    const link = await this.page.inputValue('[data-testid="payment-link-input"]');
    return link;
  }

  async verifyInvoiceGenerated() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }
}
