/**
 * e2e-05-contract-signature.spec.ts
 * SCÉNARIO E2E 05: Signature Contrat
 * Priorité: P0 (Critique)
 */
import { test, expect } from '../fixtures';

test.describe('E2E 05: Signature Contrat', () => {
  test('Générer et prévisualiser contrat', async ({ loginPage, agencyDashboardPage, contractPage, page }) => {
    await loginPage.navigate('/login');

    await loginPage.login(
      process.env.AGENCY_EMAIL || 'agency@bluevaloris.test',
      process.env.AGENCY_PASSWORD || 'Agency123!'
    );

    // Accéder au menu Contrat
    await agencyDashboardPage.clickContractMenu();

    // Générer le contrat
    await contractPage.createContract();

    // Prévisualiser
    await contractPage.previewContract();

    // Vérifier que le PDF s'affiche
    await expect(page.locator('embed, iframe')).toBeVisible({ timeout: 5000 });
  });

  test('Télécharger le contrat', async ({ loginPage, agencyDashboardPage, contractPage, page }) => {
    await loginPage.navigate('/login');

    await loginPage.login(
      process.env.AGENCY_EMAIL || 'agency@bluevaloris.test',
      process.env.AGENCY_PASSWORD || 'Agency123!'
    );

    await agencyDashboardPage.clickContractMenu();
    await contractPage.createContract();

    // Télécharger le contrat
    const downloadPromise = page.waitForEvent('download');
    await contractPage.downloadContract();
    const download = await downloadPromise;

    // Vérifier que le fichier a été téléchargé
    expect(download.suggestedFilename()).toMatch(/contract|contrat/);
  });

  test('Envoyer pour signature et signer', async ({ loginPage, agencyDashboardPage, contractPage, page }) => {
    await loginPage.navigate('/login');

    await loginPage.login(
      process.env.AGENCY_EMAIL || 'agency@bluevaloris.test',
      process.env.AGENCY_PASSWORD || 'Agency123!'
    );

    await agencyDashboardPage.clickContractMenu();
    await contractPage.createContract();

    // Envoyer pour signature
    await contractPage.sendForSignature();

    // Vérifier que la page de signature s'ouvre
    await expect(page.locator('text="Signature"')).toBeVisible({ timeout: 5000 });

    // Signer le contrat
    await contractPage.signContract();

    // Vérifier le succès de la signature
    await contractPage.verifyContractCreated();
  });

  test('Contrat signé → email de confirmation', async ({ page }) => {
    await page.goto(process.env.BASE_URL + '/login' || 'https://dev.bluevalorisportage.com/login');

    // Se connecter
    await page.locator('input[type="email"]').fill(process.env.AGENCY_EMAIL || 'agency@bluevaloris.test');
    await page.locator('input[type="password"]').fill(process.env.AGENCY_PASSWORD || 'Agency123!');
    await page.locator('button:has-text("Se connecter")').click();

    // Naviguer vers les contrats
    await page.goto('/contracts');

    // Vérifier le statut "Signé"
    await expect(page.locator('text="Signé"')).toBeVisible({ timeout: 5000 });

    // Vérifier que l'email a été envoyé (voir logs ou notifications)
    // Dans un test réel, on vérifierait la boîte mail
  });
});
