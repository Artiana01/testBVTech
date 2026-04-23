import { Page, expect } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/dashboard');
    await this.waitForPageLoad();
  }

  async assertLoaded() {
    await expect(this.page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  }

  async assertStatCardVisible(label: string) {
    await expect(this.page.getByText(label)).toBeVisible();
  }

  async navigateTo(section: string) {
    await this.page.getByRole('link', { name: section }).click();
    await this.waitForPageLoad();
  }

  async logout() {
    await this.page.getByRole('button', { name: /logout|sign out|déconnexion/i }).click();
  }
}
