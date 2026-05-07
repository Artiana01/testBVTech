/**
 * pages/ContractPage.ts
 * Gère la création, signature et gestion des contrats
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class ContractPage extends BasePage {
  readonly newContractButton = this.page.locator('button:has-text("Nouveau contrat"), button:has-text("New Contract")');
  readonly missionSelect = this.page.locator('select[name="mission"], div[role="combobox"]');
  readonly agencyNameInput = this.page.locator('input[name="agencyName"], input[placeholder*="Agence"]');
  readonly agencyAddressInput = this.page.locator('input[name="agencyAddress"], input[placeholder*="Adresse"]');
  readonly agencyPhoneInput = this.page.locator('input[name="agencyPhone"], input[placeholder*="Téléphone"]');
  readonly createContractButton = this.page.locator('button:has-text("Créer"), button:has-text("Create Contract")');
  readonly previewButton = this.page.locator('button:has-text("Prévisualiser"), button:has-text("Preview")');
  readonly downloadButton = this.page.locator('button:has-text("Télécharger"), button:has-text("Download")');
  readonly sendForSignatureButton = this.page.locator('button:has-text("Envoyer pour signature"), button:has-text("Send for Signature")');
  readonly signButton = this.page.locator('button:has-text("Signer"), button:has-text("Sign")');
  readonly signatureCanvas = this.page.locator('canvas');
  readonly confirmSignatureButton = this.page.locator('button:has-text("Confirmer"), button:has-text("Confirm")');
  readonly successMessage = this.page.locator('[role="status"], .success, .text-green');
  readonly errorMessage = this.page.locator('[role="alert"], .error, .text-red');
  readonly contractStatus = this.page.locator('[data-testid="contract-status"], .contract-status');

  async fillContractForm(data: {
    agencyName: string;
    agencyAddress: string;
    agencyPhone: string;
  }) {
    await this.agencyNameInput.fill(data.agencyName);
    await this.agencyAddressInput.fill(data.agencyAddress);
    await this.agencyPhoneInput.fill(data.agencyPhone);
  }

  async selectMission(missionName: string) {
    await this.missionSelect.click();
    await this.page.locator(`text="${missionName}"`).click();
  }

  async createContract() {
    await this.createContractButton.click();
  }

  async previewContract() {
    await this.previewButton.click();
  }

  async downloadContract() {
    await this.downloadButton.click();
  }

  async sendForSignature() {
    await this.sendForSignatureButton.click();
  }

  async signContract() {
    await this.signButton.click();
    // Simuler la signature sur le canvas
    await this.signatureCanvas.click({ position: { x: 50, y: 50 } });
    await this.signatureCanvas.click({ position: { x: 100, y: 100 } });
    await this.confirmSignatureButton.click();
  }

  async verifyContractCreated() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }
}
