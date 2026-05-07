/**
 * pages/KycPage.ts
 * Gère la vérification KYC
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class KycPage extends BasePage {
  readonly submitKycButton = this.page.locator('button:has-text("Soumettre"), button:has-text("Submit KYC")');
  readonly idDocumentInput = this.page.locator('input[type="file"][name*="idDocument"], input[type="file"]').first();
  readonly addressProofInput = this.page.locator('input[type="file"][name*="addressProof"], input[type="file"]').nth(1);
  readonly professionalDocumentInput = this.page.locator('input[type="file"][name*="professionalDoc"], input[type="file"]').nth(2);
  readonly kycStatus = this.page.locator('[data-testid="kyc-status"], .kyc-status');
  readonly verificationCheckbox = this.page.locator('input[type="checkbox"]');
  readonly successMessage = this.page.locator('[role="status"], .success, .text-green');
  readonly errorMessage = this.page.locator('[role="alert"], .error, .text-red');

  async uploadKycDocuments(idDocPath: string, addressDocPath: string, professionalDocPath?: string) {
    await this.idDocumentInput.setInputFiles(idDocPath);
    await this.addressProofInput.setInputFiles(addressDocPath);
    if (professionalDocPath) {
      await this.professionalDocumentInput.setInputFiles(professionalDocPath);
    }
  }

  async acceptVerification() {
    await this.verificationCheckbox.check();
  }

  async submitKyc() {
    await this.submitKycButton.click();
  }

  async verifyKycSubmitted() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyKycStatus(status: string) {
    await expect(this.page.locator(`text="${status}"`)).toBeVisible();
  }
}
