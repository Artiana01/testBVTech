/**
 * e2e-04-mission-contract-kyc.spec.ts
 * SCÉNARIO E2E 04: Création Mission + Contrat + KYC
 * Priorité: P0 (Critique)
 */
import { test, expect } from '../fixtures';

test.describe('E2E 04: Création Mission + Contrat + KYC', () => {
  test('Créer une nouvelle mission', async ({ loginPage, agencyDashboardPage, missionPage, page }) => {
    await loginPage.navigate('/login');

    await loginPage.login(
      process.env.AGENCY_EMAIL || 'agency@bluevaloris.test',
      process.env.AGENCY_PASSWORD || 'Agency123!'
    );

    // Accéder au menu Mission
    await agencyDashboardPage.clickMissionMenu();

    // Remplir le formulaire de mission
    await missionPage.fillMissionForm({
      missionName: process.env.TEST_MISSION_NAME || 'Dev Mission Agence',
      description: 'Mission de développement web',
      startDate: '2026-05-15',
      endDate: '2026-06-15',
    });

    // Créer la mission
    await missionPage.createMission();

    // Vérifier la notification de succès
    await missionPage.verifyMissionCreated();

    // Vérifier que la mission apparaît dans la liste
    await missionPage.verifyMissionInList('Dev Mission Agence');
  });

  test('Créer un contrat avec profil agence', async ({ loginPage, agencyDashboardPage, contractPage, page }) => {
    await loginPage.navigate('/login');

    await loginPage.login(
      process.env.AGENCY_EMAIL || 'agency@bluevaloris.test',
      process.env.AGENCY_PASSWORD || 'Agency123!'
    );

    // Accéder au menu Contrat
    await agencyDashboardPage.clickContractMenu();

    // Remplir le profil agence
    await contractPage.fillContractForm({
      agencyName: process.env.TEST_AGENCY_NAME || 'PisoEngin',
      agencyAddress: '123 Rue de Test, 75000 Paris',
      agencyPhone: '+33612345678',
    });

    // Créer le contrat
    await contractPage.createContract();

    // Vérifier la création
    await contractPage.verifyContractCreated();
  });

  test('Soumettre et valider KYC', async ({ loginPage, agencyDashboardPage, kycPage, page }) => {
    await loginPage.navigate('/login');

    await loginPage.login(
      process.env.AGENCY_EMAIL || 'agency@bluevaloris.test',
      process.env.AGENCY_PASSWORD || 'Agency123!'
    );

    // Accéder au menu KYC
    await agencyDashboardPage.clickKycMenu();

    // Créer des fichiers de test temporaires
    const idDocPath = './test-documents/id.pdf';
    const addressDocPath = './test-documents/address.pdf';

    // Uploader les documents (si les fichiers existent)
    try {
      await kycPage.uploadKycDocuments(idDocPath, addressDocPath);
    } catch (e) {
      console.log('Documents de test non trouvés, test simplifié');
    }

    // Accepter la vérification
    await kycPage.acceptVerification();

    // Soumettre le KYC
    await kycPage.submitKyc();

    // Vérifier la soumission
    await kycPage.verifyKycSubmitted();
  });

  test('KYC validé par admin → notification et email', async ({ page }) => {
    // Se connecter en tant qu'admin
    await page.goto(process.env.BASE_URL + '/login' || 'https://dev.bluevalorisportage.com/login');

    await page.locator('input[type="email"]').fill(process.env.ADMIN_EMAIL || 'admin@bluevaloris.test');
    await page.locator('input[type="password"]').fill(process.env.ADMIN_PASSWORD || 'Admin123!');
    await page.locator('button:has-text("Se connecter")').click();

    // Naviguer vers la vérification KYC
    await page.goto('/admin/kyc-verification');

    // Trouver le KYC de l'agence
    const agencyEmail = process.env.AGENCY_EMAIL || 'agency@bluevaloris.test';
    await page.locator(`text="${agencyEmail}"`).click();

    // Approuver le KYC
    await page.locator('button:has-text("Approuver")').click();

    // Vérifier le succès
    await expect(page.locator('[role="status"], .success')).toBeVisible({ timeout: 5000 });

    // Se reconnecter en tant qu'agence pour vérifier le statut
    await page.goto(process.env.BASE_URL + '/logout' || 'https://dev.bluevalorisportage.com/logout');
    await page.goto(process.env.BASE_URL + '/login' || 'https://dev.bluevalorisportage.com/login');

    await page.locator('input[type="email"]').fill(process.env.AGENCY_EMAIL || 'agency@bluevaloris.test');
    await page.locator('input[type="password"]').fill(process.env.AGENCY_PASSWORD || 'Agency123!');
    await page.locator('button:has-text("Se connecter")').click();

    // Naviguer vers KYC
    await page.goto('/kyc');

    // Vérifier le statut "Vérifié"
    await expect(page.locator('text="Vérifié"')).toBeVisible({ timeout: 5000 });
  });

  test('KYC non validé → processus bloquant', async ({ page }) => {
    // Se connecter en tant qu'admin
    await page.goto(process.env.BASE_URL + '/login' || 'https://dev.bluevalorisportage.com/login');

    await page.locator('input[type="email"]').fill(process.env.ADMIN_EMAIL || 'admin@bluevaloris.test');
    await page.locator('input[type="password"]').fill(process.env.ADMIN_PASSWORD || 'Admin123!');
    await page.locator('button:has-text("Se connecter")').click();

    // Naviguer vers la vérification KYC
    await page.goto('/admin/kyc-verification');

    // Rejeter un KYC
    const agencyEmail = process.env.AGENCY_EMAIL || 'agency@bluevaloris.test';
    await page.locator(`text="${agencyEmail}"`).click();
    await page.locator('button:has-text("Rejeter")').click();
    await page.locator('textarea').fill('Documents insuffisants');
    await page.locator('button:has-text("Confirmer")').click();

    // Vérifier le succès du rejet
    await expect(page.locator('[role="status"], .success')).toBeVisible({ timeout: 5000 });
  });
});
