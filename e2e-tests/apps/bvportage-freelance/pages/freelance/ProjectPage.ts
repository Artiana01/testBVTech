import { Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class ProjectPage extends BasePage {
  // Locators
  readonly projectList = '[class*="project"], table';
  readonly projectNameField = 'input[name*="project"], input[placeholder*="Projet"]';
  readonly clientEmailField = 'input[type="email"]';
  readonly createButton = 'button[type="submit"]:has-text("Créer")';
  readonly successMessage = '.success-message, .alert-success';
  readonly projectStatus = '[class*="status"], .badge';

  constructor(page: Page) {
    super(page);
  }

  async createProject(projectName: string, clientEmail: string) {
    await this.fill(this.projectNameField, projectName);
    await this.fill(this.clientEmailField, clientEmail);
    await this.click(this.createButton);
  }

  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successMessage);
  }

  async isSuccessVisible(): Promise<boolean> {
    return await this.isVisible(this.successMessage);
  }

  async isProjectVisible(projectName: string): Promise<boolean> {
    return await this.isVisible(`text="${projectName}"`);
  }
}
