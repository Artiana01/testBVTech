/**
 * pages/MissionPage.ts
 * Gère la création et gestion des missions
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class MissionPage extends BasePage {
  readonly newMissionButton = this.page.locator('button:has-text("Nouvelle mission"), button:has-text("New Mission")');
  readonly missionNameInput = this.page.locator('input[name="missionName"], input[placeholder*="Nom"], input[placeholder*="Mission"]');
  readonly missionDescriptionTextarea = this.page.locator('textarea[name="description"], textarea[placeholder*="Description"]');
  readonly missionStartDateInput = this.page.locator('input[type="date"][name*="start"]');
  readonly missionEndDateInput = this.page.locator('input[type="date"][name*="end"]');
  readonly createButton = this.page.locator('button:has-text("Créer"), button:has-text("Create")');
  readonly successMessage = this.page.locator('[role="status"], .success, .text-green');
  readonly errorMessage = this.page.locator('[role="alert"], .error, .text-red');
  readonly missionList = this.page.locator('[data-testid="mission-list"], .mission-item');

  async fillMissionForm(data: {
    missionName: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }) {
    await this.missionNameInput.fill(data.missionName);
    if (data.description) {
      await this.missionDescriptionTextarea.fill(data.description);
    }
    if (data.startDate) {
      await this.missionStartDateInput.fill(data.startDate);
    }
    if (data.endDate) {
      await this.missionEndDateInput.fill(data.endDate);
    }
  }

  async createMission() {
    await this.createButton.click();
  }

  async verifyMissionCreated() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyMissionInList(missionName: string) {
    await expect(this.page.locator(`text="${missionName}"`)).toBeVisible();
  }
}
