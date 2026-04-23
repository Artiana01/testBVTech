import { Page, expect } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/login');
    await this.waitForPageLoad();
  }

  async fillEmail(email: string) {
    await this.page.getByLabel(/email/i).fill(email);
  }

  async fillPassword(password: string) {
    await this.page.getByLabel(/password|mot de passe/i).fill(password);
  }

  async submit() {
    await this.page.getByRole('button', { name: /sign in|login|connexion/i }).click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
    await this.waitForPageLoad();
  }

  async assertLoginError() {
    const error = this.page.getByRole('alert');
    await expect(error).toBeVisible();
  }

  async assertLoggedIn() {
    await expect(this.page).not.toHaveURL(/login/);
  }
}
