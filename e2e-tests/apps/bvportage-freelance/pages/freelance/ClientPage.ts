import { Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class ClientPage extends BasePage {
  // Locators
  readonly addClientButton = 'button:has-text("Ajouter client"), button:has-text("Nouveau client")';
  readonly clientNameField = 'input[name*="name"], input[name*="nom"]';
  readonly clientEmailField = 'input[type="email"]';
  readonly clientListTable = 'table, [class*="table"], [class*="list"]';
  readonly createProjectButton = 'button:has-text("Projet"), button:has-text("Nouveau projet")';
  readonly projectNameField = 'input[name*="project"], input[placeholder*="Projet"]';
  readonly saveProjectButton = 'button[type="submit"]:has-text("Créer")';
  readonly successMessage = '.success-message, .alert-success, text=succès';
  readonly errorMessage = '.error-message, .alert-danger';
  readonly existingClientAlert = '.alert, .warning, text=déjà';

  constructor(page: Page) {
    super(page);
  }

  async addNewClient(clientName: string, clientEmail: string) {
    await this.click(this.addClientButton);
    await this.fill(this.clientNameField, clientName);
    await this.fill(this.clientEmailField, clientEmail);
  }

  async createProject(projectName: string, clientEmail: string) {
    await this.click(this.createProjectButton);
    await this.fill(this.projectNameField, projectName);
    await this.fill(this.clientEmailField, clientEmail);
    await this.click(this.saveProjectButton);
  }

  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successMessage);
  }

  async isSuccessVisible(): Promise<boolean> {
    return await this.isVisible(this.successMessage);
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  async isExistingClientDetected(): Promise<boolean> {
    return await this.isVisible(this.existingClientAlert);
  }
}
