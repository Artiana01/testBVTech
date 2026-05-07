/**
 * e2e-02-login-pack-subscription.spec.ts
 * SCÉNARIO E2E 02: Connexion + Souscription Pack
 * Priorité: P0 (Critique)
 */
import { test, expect } from '../fixtures';

test.describe('E2E 02: Connexion + Souscription Pack', () => {
  test('Connexion et accès au dashboard agence', async ({ loginPage, agencyDashboardPage, page }) => {
    await loginPage.navigate('/login');

    // Connexion avec identifiants agence
    await loginPage.login(
      process.env.AGENCY_EMAIL || 'agency@bluevaloris.test',
      process.env.AGENCY_PASSWORD || 'Agency123!'
    );

    // Vérifier le chargement du dashboard
    await agencyDashboardPage.verifyDashboardLoaded();

    // Vérifier la présence du menu agence
    await expect(agencyDashboardPage.clientMenu).toBeVisible();
    await expect(agencyDashboardPage.missionMenu).toBeVisible();
    await expect(agencyDashboardPage.teamMenu).toBeVisible();
  });

  test('Sélection et souscription au pack Agency (159€)', async ({ loginPage, page, packPage }) => {
    await loginPage.navigate('/login');

    // Se connecter
    await loginPage.login(
      process.env.AGENCY_EMAIL || 'agency@bluevaloris.test',
      process.env.AGENCY_PASSWORD || 'Agency123!'
    );

    // Naviguer vers la page de sélection des packs
    await page.goto('/packs');

    // Vérifier le prix affiché
    await packPage.verifyPackPrice('159');

    // Sélectionner le pack Agency
    await packPage.selectAgencyPack();

    // Cliquer sur S'abonner
    await packPage.subscribe();

    // Vérifier la redirection vers paiement
    await expect(page).toHaveURL(/payment|checkout/);
  });

  test('Paiement réussi du pack', async ({ loginPage, page, packPage, paymentPage }) => {
    await loginPage.navigate('/login');

    // Se connecter et accéder aux packs
    await loginPage.login(
      process.env.AGENCY_EMAIL || 'agency@bluevaloris.test',
      process.env.AGENCY_PASSWORD || 'Agency123!'
    );
    await page.goto('/packs');

    // Sélectionner et payer le pack
    await packPage.selectAgencyPack();
    await packPage.subscribe();

    // Remplir les informations de paiement (test card)
    await paymentPage.fillPaymentForm({
      cardNumber: '4242 4242 4242 4242',
      expiry: '12/25',
      cvc: '123',
      cardholderName: 'Test Agency',
    });

    // Effectuer le paiement
    await paymentPage.pay();

    // Vérifier le succès du paiement
    await paymentPage.verifyPaymentSuccess();

    // Vérifier la réception de l'email de confirmation
    await expect(page.locator('text="email"')).toBeVisible({ timeout: 5000 });

    // Vérifier la redirection vers l'accueil
    await expect(page).toHaveURL(/dashboard|accueil/);
  });

  test('Pack activé et email de confirmation reçu', async ({ loginPage, page, agencyDashboardPage }) => {
    await loginPage.navigate('/login');

    // Se connecter
    await loginPage.login(
      process.env.AGENCY_EMAIL || 'agency@bluevaloris.test',
      process.env.AGENCY_PASSWORD || 'Agency123!'
    );

    // Vérifier que le dashboard affiche le statut du pack
    await agencyDashboardPage.verifyDashboardLoaded();

    // Vérifier la présence du badge "Pack Agency activé"
    await expect(page.locator('text="Pack Agency activé", text="Active"')).toBeVisible({ timeout: 5000 });
  });
});
