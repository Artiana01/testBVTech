/**
 * pages/LoginPage.ts
 * Gère le formulaire de connexion
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class LoginPage extends BasePage {
  readonly emailInput = this.page.locator('input[type="email"]');
  readonly passwordInput = this.page.locator('input[type="password"]');
  readonly loginButton = this.page.locator('button:has-text("Se connecter"), button:has-text("Connexion"), button:has-text("Login")');
  readonly forgotPasswordLink = this.page.locator('a:has-text("Mot de passe oublié"), a:has-text("Forgot")');
  readonly errorMessage = this.page.locator('[role="alert"], .error, .text-red');

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyLoginError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }
}
