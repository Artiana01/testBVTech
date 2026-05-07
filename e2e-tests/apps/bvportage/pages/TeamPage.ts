/**
 * pages/TeamPage.ts
 * Gère l'invitation et la gestion des membres de l'équipe
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class TeamPage extends BasePage {
  readonly inviteMemberButton = this.page.locator('button:has-text("Inviter"), button:has-text("Invite Member")');
  readonly memberEmailInput = this.page.locator('input[type="email"], input[placeholder*="Email"]');
  readonly roleSelect = this.page.locator('select[name="role"], div[role="combobox"]');
  readonly inviteButton = this.page.locator('button:has-text("Inviter"), button:has-text("Send Invitation")');
  readonly successMessage = this.page.locator('[role="status"], .success, .text-green');
  readonly errorMessage = this.page.locator('[role="alert"], .error, .text-red');
  readonly teamMemberList = this.page.locator('[data-testid="team-list"], .team-member');

  async inviteMember(email: string, role?: string) {
    await this.inviteMemberButton.click();
    await this.memberEmailInput.fill(email);
    if (role) {
      await this.roleSelect.click();
      await this.page.locator(`text="${role}"`).click();
    }
    await this.inviteButton.click();
  }

  async verifyInvitationSent() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyMemberInList(email: string) {
    await expect(this.page.locator(`text="${email}"`)).toBeVisible();
  }
}
