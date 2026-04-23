/**
 * apps/ecommerce/pages/ProfilePage.ts
 * -------------------------------------
 * Page Object pour la page profil utilisateur (/profile).
 * Couvre : affichage des infos, modification du nom.
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class ProfilePage extends BasePage {

  // --- Sélecteurs ---
  private readonly profileName      = '[data-testid="profile-name"]';       // 👉 ADAPTER
  private readonly profileEmail     = '[data-testid="profile-email"]';      // 👉 ADAPTER
  private readonly editNameBtn      = '[data-testid="edit-name-btn"]';      // 👉 ADAPTER
  private readonly nameInput        = 'input[name="name"]';                 // 👉 ADAPTER
  private readonly saveBtn          = '[data-testid="save-profile-btn"]';   // 👉 ADAPTER
  private readonly successToast     = '[data-testid="success-toast"]';      // 👉 ADAPTER
  private readonly navbarUsername   = '[data-testid="navbar-username"]';    // 👉 ADAPTER (nom affiché dans la navbar)

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/profile');
    await this.waitForLoad();
  }

  // =========================================================
  // AFFICHAGE DES INFOS
  // =========================================================

  async verifyNameIsDisplayed(): Promise<void> {
    const nameEl = this.page.locator(this.profileName)
      .or(this.page.getByText(process.env.TEST_EMAIL?.split('@')[0] ?? 'User'));
    await expect(nameEl).toBeVisible();
  }

  async verifyEmailIsDisplayed(email?: string): Promise<void> {
    const targetEmail = email ?? process.env.TEST_EMAIL ?? '';
    const emailEl = this.page.locator(this.profileEmail)
      .or(this.page.getByText(targetEmail));
    await expect(emailEl).toBeVisible();
  }

  async getCurrentName(): Promise<string> {
    const el = this.page.locator(this.profileName).first();
    return await el.innerText();
  }

  // =========================================================
  // MODIFICATION DU PROFIL
  // =========================================================

  async clickEditName(): Promise<void> {
    // 👉 ADAPTER : certains profils sont directement des formulaires, d'autres nécessitent un clic "Modifier"
    const editBtn = this.page.locator(this.editNameBtn)
      .or(this.page.getByRole('button', { name: /modifier|edit|changer/i }));
    if (await editBtn.isVisible()) {
      await editBtn.click();
    }
    // Si le formulaire est directement visible, aucun clic n'est nécessaire
  }

  async updateName(newName: string): Promise<void> {
    await this.clickEditName();

    const nameField = this.page.locator(this.nameInput)
      .or(this.page.getByLabel(/nom|name/i));
    await nameField.clear();
    await nameField.fill(newName);
  }

  async saveProfile(): Promise<void> {
    const btn = this.page.locator(this.saveBtn)
      .or(this.page.getByRole('button', { name: /sauvegarder|enregistrer|save/i }));
    await btn.click();
    await this.page.waitForLoadState('load');
  }

  async verifyProfileSaved(): Promise<void> {
    // 👉 ADAPTER : vérifier un toast ou un message de succès
    const successEl = this.page.locator(this.successToast)
      .or(this.page.getByText(/profil mis à jour|profile updated|sauvegardé/i))
      .or(this.page.getByRole('alert'));
    await expect(successEl).toBeVisible({ timeout: 5_000 });
  }

  async verifyNameInNavbar(expectedName: string): Promise<void> {
    // 👉 ADAPTER : vérifier que le nouveau nom apparaît dans la navbar
    const navName = this.page.locator(this.navbarUsername)
      .or(this.page.getByText(expectedName, { exact: false }));
    await expect(navName.first()).toBeVisible({ timeout: 5_000 });
  }
}
