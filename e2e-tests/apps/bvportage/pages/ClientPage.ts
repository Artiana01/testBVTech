/**
 * pages/ClientPage.ts
 * Gère la création et gestion des clients
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class ClientPage extends BasePage {
  readonly newClientButton = this.page.locator('button:has-text("Nouveau client"), button:has-text("New Client")');
  readonly clientNameInput = this.page.locator('input[name="clientName"], input[placeholder*="Nom"]');
  readonly companyNameInput = this.page.locator('input[name="companyName"], input[placeholder*="Entreprise"]');
  readonly clientEmailInput = this.page.locator('input[name="clientEmail"], input[placeholder*="Email"]');
  readonly projectTitleInput = this.page.locator('input[name="projectTitle"], input[placeholder*="Projet"]');
  readonly projectDescriptionTextarea = this.page.locator('textarea[name="description"], textarea[placeholder*="Description"]');
  readonly createButton = this.page.locator('button:has-text("Créer"), button:has-text("Create")');
  readonly successMessage = this.page.locator('[role="status"], .success, .text-green');
  readonly errorMessage = this.page.locator('[role="alert"], .error, .text-red');
  readonly clientList = this.page.locator('[data-testid="client-list"], .client-item');

  async fillClientForm(data: {
    clientName: string;
    companyName: string;
    clientEmail: string;
    projectTitle: string;
    projectDescription?: string;
  }) {
    await this.clientNameInput.fill(data.clientName);
    await this.companyNameInput.fill(data.companyName);
    await this.clientEmailInput.fill(data.clientEmail);
    await this.projectTitleInput.fill(data.projectTitle);
    if (data.projectDescription) {
      await this.projectDescriptionTextarea.fill(data.projectDescription);
    }
  }

  async createClient() {
    await this.createButton.click();
  }

  async verifyClientCreated() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyClientCreationError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyClientInList(clientName: string) {
    await expect(this.page.locator(`text="${clientName}"`)).toBeVisible();
  }
}
