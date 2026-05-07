/**
 * pages/SignupPage.ts
 * Gère le formulaire d'inscription des agences
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class SignupPage extends BasePage {
  // Locators pour le formulaire d'inscription
  readonly firstNameInput = this.page.locator('input[name="firstName"], input[placeholder*="Nom"], input[placeholder*="nom"]');
  readonly lastNameInput = this.page.locator('input[name="lastName"], input[placeholder*="Prénom"]');
  readonly emailInput = this.page.locator('input[type="email"]');
  readonly passwordInput = this.page.locator('input[name="password"], input[type="password"]');
  readonly confirmPasswordInput = this.page.locator('input[name="confirmPassword"], input[placeholder*="Confirmation"]');
  readonly civilitySelect = this.page.locator('select[name="civility"], div[role="combobox"]:has-text("Civilité")').first();
  readonly nationalitySelect = this.page.locator('select[name="nationality"], div[role="combobox"]:has-text("Nationalité")').first();
  readonly termsCheckbox = this.page.locator('input[type="checkbox"]');
  readonly signupButton = this.page.locator('button:has-text("S\'inscrire"), button:has-text("Inscription"), button:has-text("Sign Up")');
  readonly googleButton = this.page.locator('button:has-text("Google")');
  readonly errorMessage = this.page.locator('[role="alert"], .error, .text-red');
  readonly successMessage = this.page.locator('[role="status"], .success, .text-green');

  async fillSignupForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    civility?: string;
    nationality?: string;
  }) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.password);

    if (data.civility) {
      await this.civilitySelect.click();
      await this.page.locator(`text="${data.civility}"`).click();
    }

    if (data.nationality) {
      await this.nationalitySelect.click();
      await this.page.locator(`text="${data.nationality}"`).click();
    }
  }

  async acceptTerms() {
    await this.termsCheckbox.check();
  }

  async submitSignup() {
    await this.signupButton.click();
  }

  async verifySignupSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyValidationError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyGoogleButtonExists() {
    await expect(this.googleButton).toBeVisible();
  }
}
