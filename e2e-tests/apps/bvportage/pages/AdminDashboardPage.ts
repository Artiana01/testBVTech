/**
 * pages/AdminDashboardPage.ts
 * Gère le dashboard de l'admin
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class AdminDashboardPage extends BasePage {
  readonly kycVerificationButton = this.page.locator('button:has-text("KYC"), a:has-text("KYC Verification")');
  readonly usersMenu = this.page.locator('a:has-text("Utilisateurs"), nav button:has-text("Users")');
  readonly clientsList = this.page.locator('[data-testid="clients-list"], .client-item');
  readonly kycDocuments = this.page.locator('[data-testid="kyc-docs"], .kyc-document');
  readonly approveButton = this.page.locator('button:has-text("Approuver"), button:has-text("Approve")');
  readonly rejectButton = this.page.locator('button:has-text("Rejeter"), button:has-text("Reject")');
  readonly successMessage = this.page.locator('[role="status"], .success, .text-green');

  async navigateToKycVerification() {
    await this.kycVerificationButton.click();
  }

  async viewClientKyc(clientEmail: string) {
    await this.page.locator(`text="${clientEmail}"`).click();
  }

  async approveKyc() {
    await this.approveButton.click();
  }

  async rejectKyc(reason?: string) {
    await this.rejectButton.click();
    if (reason) {
      const reasonInput = this.page.locator('textarea[placeholder*="Raison"], textarea[placeholder*="Reason"]');
      await reasonInput.fill(reason);
    }
  }

  async verifyClientCreated(clientEmail: string) {
    await expect(this.page.locator(`text="${clientEmail}"`)).toBeVisible();
  }

  async verifyKycApprovalSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }
}
