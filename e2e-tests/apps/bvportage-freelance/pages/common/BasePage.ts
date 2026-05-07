import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'https://dev.bluevalorisportage.com';
  }

  async goto(path: string = '') {
    await this.page.goto(`${this.baseURL}${path}`);
  }

  async waitForLoad(selector?: string) {
    if (selector) {
      await this.page.waitForSelector(selector, { timeout: 60000 });
    } else {
      await this.page.waitForLoadState('networkidle');
    }
  }

  async click(selector: string) {
    await this.page.click(selector);
  }

  async fill(selector: string, text: string) {
    await this.page.fill(selector, text);
  }

  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  async waitForSelector(selector: string, timeout: number = 60000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `./screenshots/${name}.png`, fullPage: true });
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }
}
