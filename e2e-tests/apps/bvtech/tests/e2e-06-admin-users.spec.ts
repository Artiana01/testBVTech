/**
 * apps/bvtech/tests/e2e-06-admin-users.spec.ts
 * ------------------------------------------------
 * E2E 06 : Gestion utilisateurs (ADMIN, CRITIQUE)
 *
 * Étapes :
 *   1. Se connecter admin
 *   2. Aller dans "Utilisateurs"
 *   3. Modifier un utilisateur
 *   4. Sauvegarder
 *
 * Résultat attendu :
 *   ● Données modifiées correctement
 *
 * Priorité : Critique
 */

import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

test.describe('E2E 06 — Gestion utilisateurs (ADMIN, CRITIQUE)', () => {

  test('06.1 — Accéder à la liste des utilisateurs', async ({ page }) => {
    test.setTimeout(60_000);
    const loginPage = new LoginPage(page);
    const adminDashboard = new AdminDashboardPage(page);
    const usersPage = new AdminUsersPage(page);

    // 1. Se connecter en admin
    await loginPage.loginAsAdmin();
    await loginPage.verifyLoginSuccess();
    await page.waitForTimeout(2000);

    // 2. Aller dans "Utilisateurs"
    await adminDashboard.navigateToUsers();

    // Vérifier que la liste des utilisateurs est visible
    await usersPage.verifyUsersListVisible();
  });

  test('06.2 — La liste contient au moins un utilisateur', async ({ page }) => {
    test.setTimeout(60_000);
    const loginPage = new LoginPage(page);
    const adminDashboard = new AdminDashboardPage(page);
    const usersPage = new AdminUsersPage(page);

    // Se connecter en admin
    await loginPage.loginAsAdmin();
    await loginPage.verifyLoginSuccess();
    await page.waitForTimeout(2000);

    // Aller dans Utilisateurs
    await adminDashboard.navigateToUsers();
    await usersPage.verifyUsersListVisible();

    // Vérifier qu'il y a au moins un utilisateur
    const count = await usersPage.getUsersCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('06.3 — Modifier un utilisateur et sauvegarder', async ({ page }) => {
    test.setTimeout(60_000);
    const loginPage = new LoginPage(page);
    const adminDashboard = new AdminDashboardPage(page);
    const usersPage = new AdminUsersPage(page);

    // 1. Se connecter en admin
    await loginPage.loginAsAdmin();
    await loginPage.verifyLoginSuccess();
    await page.waitForTimeout(2000);

    // 2. Aller dans "Utilisateurs"
    await adminDashboard.navigateToUsers();
    await usersPage.verifyUsersListVisible();

    // 3. Cliquer sur modifier le premier utilisateur
    await usersPage.clickEditFirstUser();

    // 4. Modifier un champ (nom par exemple)
    await usersPage.modifyUserField('name', 'Utilisateur Modifié E2E');

    // 5. Sauvegarder
    await usersPage.saveUserModification();

    // 6. Vérifier que la modification est sauvegardée
    await usersPage.verifyModificationSaved();
  });

  test('06.4 — Rechercher un utilisateur', async ({ page }) => {
    test.setTimeout(60_000);
    const loginPage = new LoginPage(page);
    const adminDashboard = new AdminDashboardPage(page);
    const usersPage = new AdminUsersPage(page);

    // Se connecter en admin
    await loginPage.loginAsAdmin();
    await loginPage.verifyLoginSuccess();
    await page.waitForTimeout(2000);

    // Aller dans Utilisateurs
    await adminDashboard.navigateToUsers();
    await usersPage.verifyUsersListVisible();

    // Rechercher un utilisateur
    await usersPage.searchUser('webmaster');
    await page.waitForTimeout(1000);

    // Vérifier que la recherche fonctionne
    await usersPage.verifyUserInList('webmaster');
  });

});
