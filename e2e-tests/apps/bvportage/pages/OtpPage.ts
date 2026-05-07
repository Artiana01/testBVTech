/**
 * pages/OtpPage.ts
 * Gère la page de validation OTP
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class OtpPage extends BasePage {
  readonly otpInput = this.page.locator('input[placeholder*="OTP"], input[placeholder*="code"]');
  readonly verifyButton = this.page.locator('button:has-text("Vérifier"), button:has-text("Valider"), button:has-text("Verify")');
  readonly resendButton = this.page.locator('button:has-text("Renvoyer"), button:has-text("Resend")');
  readonly successMessage = this.page.locator('[role="status"], .success, .text-green');
  readonly errorMessage = this.page.locator('[role="alert"], .error, .text-red');

  async enterOtp(otp: string) {
    await this.otpInput.fill(otp);
  }

  async verifyOtp() {
    await this.verifyButton.click();
  }

  async resendOtp() {
    await this.resendButton.click();
  }

  async verifyOtpSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyOtpError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }
}
