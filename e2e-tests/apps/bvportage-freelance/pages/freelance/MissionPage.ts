import { Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class MissionPage extends BasePage {
  // Locators
  readonly missionList = '[class*="mission"], table';
  readonly createMissionButton = 'button:has-text("Créer"), button:has-text("Nouvelle mission")';
  readonly missionTitleField = 'input[name*="title"], input[placeholder*="Titre"]';
  readonly missionAmountField = 'input[type="number"], input[name*="amount"]';
  readonly descriptionField = 'textarea';
  readonly saveMissionButton = 'button[type="submit"]:has-text("Créer")';
  readonly successMessage = '.success-message, .alert-success, text=succès';
  readonly missionStatus = '[class*="status"], .badge';
  readonly draftStatus = 'text=Brouillon';
  readonly editButton = 'button[title*="Éditer"], button:has-text("✏️")';
  readonly createContractButton = 'button:has-text("Contrat"), button:has-text("Créer contrat")';

  constructor(page: Page) {
    super(page);
  }

  async createMission(title: string, amount: string) {
    await this.click(this.createMissionButton);
    await this.fill(this.missionTitleField, title);
    await this.fill(this.missionAmountField, amount);
    await this.click(this.saveMissionButton);
  }

  async editMission(missionTitle: string) {
    const missionRow = this.page.locator(`text="${missionTitle}"`).first();
    const editBtn = missionRow.locator(this.editButton).first();
    await editBtn.click();
  }

  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successMessage);
  }

  async isSuccessVisible(): Promise<boolean> {
    return await this.isVisible(this.successMessage);
  }

  async isDraftStatus(): Promise<boolean> {
    return await this.isVisible(this.draftStatus);
  }

  async createContract() {
    await this.click(this.createContractButton);
  }

  async isMissionVisible(title: string): Promise<boolean> {
    return await this.isVisible(`text="${title}"`);
  }
}
