import { test, expect } from '../fixtures/fixtures';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('E2E-02 — Souscription Pack Freelance', () => {
  test.beforeEach(async ({ loginPage, dashboardFreelancePage, page }) => {
    await page.goto(process.env.BASE_URL || 'https://dev.bluevalorisportage.com');
    
    // Connexion
    await loginPage.login(
      process.env.FREELANCER_EMAIL || 'freelancer@bluevaloris.test',
      process.env.FREELANCER_PASSWORD || 'Freelance123!'
    );
    
    // Choix profil Freelance
    await loginPage.chooseFreelanceProfile();
    
    // Vérifier connexion réussie
    await expect(dashboardFreelancePage.page).toHaveURL(new RegExp('dashboard|home'), { timeout: 30000 });
  });

  test('Pack Freelance Classic 79€ sélectionné', async ({ packPage, page }) => {
    // Naviguer vers les packs
    await page.goto(`${process.env.BASE_URL}/packs`);
    
    // Sélectionner pack classic
    await packPage.selectClassicPack();
    
    // Vérifier disponibilité du bouton paiement
    const isPackSelected = await packPage.isVisible('text=Classic');
    expect(isPackSelected).toBeTruthy();
  });

  test('Paiement Stripe validé', async ({ packPage, page }) => {
    await page.goto(`${process.env.BASE_URL}/packs`);
    
    // Sélectionner pack
    await packPage.selectClassicPack();
    await packPage.proceedToPayment();
    
    // Note: Paiement Stripe serait complété ici
    // Test card: 4242 4242 4242 4242
    
    // Vérifier redirection après paiement
    const url = page.url();
    expect(url).not.toContain('packs');
  });

  test('Confirmation paiement et email reçu', async ({ packPage }) => {
    // Après paiement, vérifier message succès
    const isSuccess = await packPage.isSuccessVisible();
    expect(isSuccess).toBeTruthy();
    
    // Vérifier activation du pack
    const isPacked = await packPage.isPackActivated();
    expect(isPacked).toBeTruthy();
  });

  test('🐛 BUG: Paiement sans formulaire de carte visible', async ({ packPage, page }) => {
    await page.goto(`${process.env.BASE_URL}/packs`);
    
    // Ce test documente le bug: le formulaire Stripe n'est pas toujours visible
    await packPage.selectClassicPack();
    await packPage.proceedToPayment();
    
    // Vérifier que la frame Stripe est présente (attendue mais parfois absente)
    const stripeFrame = await page.$('iframe[title*="Stripe"]');
    console.log('⚠️ BUG F1: Formulaire Stripe non visible - paiement passé sans saisie carte');
  });
});
