/**
 * pages/AgencyDashboardPage.ts
 * Gère la page d'accueil et le dashboard de l'agence
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class AgencyDashboardPage extends BasePage {
  // Navigation
  readonly clientMenu = this.page.locator('a:has-text("Client"), nav button:has-text("Client")');
  readonly missionMenu = this.page.locator('a:has-text("Mission"), nav button:has-text("Mission")');
  readonly teamMenu = this.page.locator('a:has-text("Équipe"), nav button:has-text("Team")');
  readonly contractMenu = this.page.locator('a:has-text("Contrat"), nav button:has-text("Contract")');
  readonly invoiceMenu = this.page.locator('a:has-text("Facture"), nav button:has-text("Invoice")');
  readonly kycMenu = this.page.locator('a:has-text("KYC"), nav button:has-text("KYC")');
  readonly profileMenu = this.page.locator('a:has-text("Profil"), nav button:has-text("Profile")');
  readonly logoutButton = this.page.locator('button:has-text("Déconnexion"), button:has-text("Logout")');

  // Elements de page
  readonly newClientButton = this.page.locator('button:has-text("Nouveau client"), button:has-text("New Client")');
  readonly dashboardTitle = this.page.locator('h1, h2');
  readonly successNotification = this.page.locator('[role="status"], .success, .toast-success');

  async clickClientMenu() {
    await this.clientMenu.click();
  }

  async clickMissionMenu() {
    await this.missionMenu.click();
  }

  async clickTeamMenu() {
    await this.teamMenu.click();
  }

  async clickContractMenu() {
    await this.contractMenu.click();
  }

  async clickInvoiceMenu() {
    await this.invoiceMenu.click();
  }

  async clickKycMenu() {
    await this.kycMenu.click();
  }

  async clickProfileMenu() {
    await this.profileMenu.click();
  }

  async clickNewClient() {
    await this.newClientButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }

  async verifyDashboardLoaded() {
    await expect(this.dashboardTitle).toBeVisible();
  }

  async verifySuccessNotification() {
    await expect(this.successNotification).toBeVisible({ timeout: 5000 });
  }
}
