/**
 * e2e-03-client-creation.spec.ts
 * SCÉNARIO E2E 03: Création Client + Projet
 * Priorité: P0 (Critique)
 */
import { test, expect } from '../fixtures';

test.describe('E2E 03: Création Client + Projet', () => {
  test('Création d\'un client avec tous les champs remplis', async ({ loginPage, agencyDashboardPage, clientPage, page }) => {
    await loginPage.navigate('/login');

    // Se connecter
    await loginPage.login(
      process.env.AGENCY_EMAIL || 'agency@bluevaloris.test',
      process.env.AGENCY_PASSWORD || 'Agency123!'
    );

    // Accéder au menu Client
    await agencyDashboardPage.clickClientMenu();

    // Cliquer sur "Nouveau client"
    await agencyDashboardPage.clickNewClient();

    // Remplir le formulaire complet
    const clientEmail = `client-${Date.now()}@bluevaloris.test`;
    await clientPage.fillClientForm({
      clientName: process.env.TEST_CLIENT_NAME || 'Piso Rak',
      companyName: 'Piso Company',
      clientEmail: clientEmail,
      projectTitle: process.env.TEST_PROJECT_TITLE || 'Developpement web test agence',
      projectDescription: 'Project for testing agency platform',
    });

    // Créer le client
    await clientPage.createClient();

    // Vérifier la notification de succès
    await clientPage.verifyClientCreated();

    // Vérifier que le client apparaît dans la liste
    await clientPage.verifyClientInList('Piso Rak');
  });

  test('Création échoue avec email seul (point critique UX)', async ({ loginPage, agencyDashboardPage, clientPage, page }) => {
    await loginPage.navigate('/login');

    // Se connecter
    await loginPage.login(
      process.env.AGENCY_EMAIL || 'agency@bluevaloris.test',
      process.env.AGENCY_PASSWORD || 'Agency123!'
    );

    // Accéder au menu Client
    await agencyDashboardPage.clickClientMenu();
    await agencyDashboardPage.clickNewClient();

    // Remplir seulement l'email
    const clientEmail = `client-${Date.now()}@bluevaloris.test`;
    await clientPage.clientEmailInput.fill(clientEmail);

    // Essayer de créer
    await clientPage.createClient();

    // Vérifier que la création échoue
    await clientPage.verifyClientCreationError();
  });

  test('Projet créé et associé au client', async ({ loginPage, agencyDashboardPage, clientPage, page }) => {
    await loginPage.navigate('/login');

    await loginPage.login(
      process.env.AGENCY_EMAIL || 'agency@bluevaloris.test',
      process.env.AGENCY_PASSWORD || 'Agency123!'
    );

    await agencyDashboardPage.clickClientMenu();
    await agencyDashboardPage.clickNewClient();

    // Remplir le formulaire
    const clientEmail = `client-${Date.now()}@bluevaloris.test`;
    await clientPage.fillClientForm({
      clientName: 'Test Client',
      companyName: 'Test Company',
      clientEmail: clientEmail,
      projectTitle: 'Test Project',
    });

    await clientPage.createClient();
    await clientPage.verifyClientCreated();

    // Vérifier que le projet est visible dans le profil du client
    await expect(page.locator('text="Test Project"')).toBeVisible({ timeout: 5000 });
  });

  test('Voir le client créé dans l\'admin', async ({ page }) => {
    // Se connecter en tant qu'admin
    const loginUrl = process.env.BASE_URL + '/login';
    await page.goto(loginUrl);

    await page.locator('input[type="email"]').fill(process.env.ADMIN_EMAIL || 'admin@bluevaloris.test');
    await page.locator('input[type="password"]').fill(process.env.ADMIN_PASSWORD || 'Admin123!');
    await page.locator('button:has-text("Se connecter")').click();

    // Naviguer vers la section des clients
    await page.goto('/admin/clients');

    // Vérifier que le client créé est visible avec l'email de l'agence
    const agencyEmail = process.env.AGENCY_EMAIL || 'agency@bluevaloris.test';
    await expect(page.locator(`text="${agencyEmail}"`)).toBeVisible({ timeout: 5000 });
  });
});
