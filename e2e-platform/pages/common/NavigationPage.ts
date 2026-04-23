import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class NavigationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async clickNavLink(label: string) {
    await this.page.getByRole('link', { name: label }).click();
  }

  async assertNavLinkVisible(label: string) {
    await this.page.getByRole('link', { name: label }).isVisible();
  }

  async openMobileMenu() {
    const menuBtn = this.page.getByRole('button', { name: /menu/i });
    if (await menuBtn.isVisible()) await menuBtn.click();
  }
}
