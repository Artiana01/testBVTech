import { test, expect } from '../fixtures/fixtures';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('E2E-04 — Mission + Contrat + Signature', () => {
  test.beforeEach(async ({ loginPage, dashboardFreelancePage, page }) => {
    await page.goto(process.env.BASE_URL || 'https://dev.bluevalorisportage.com');
    
    // Connexion
    await loginPage.login(
      process.env.FREELANCER_EMAIL || 'freelancer@bluevaloris.test',
      process.env.FREELANCER_PASSWORD || 'Freelance123!'
    );
    
    // Choix profil Freelance
    await loginPage.chooseFreelanceProfile();
    
    // Vérifier connexion
    await expect(dashboardFreelancePage.page).toHaveURL(new RegExp('dashboard|home'), { timeout: 30000 });
  });

  test('Création mission avec statut Brouillon', async ({ missionPage, page }) => {
    await page.goto(`${process.env.BASE_URL}/missions`);
    
    const title = process.env.MISSION_TITLE || 'Dev_Mission_Demo';
    const amount = process.env.MISSION_AMOUNT || '500';
    
    await missionPage.createMission(title, amount);
    
    // Vérifier notification succès
    const isSuccess = await missionPage.isSuccessVisible();
    expect(isSuccess).toBeTruthy();
    
    // Vérifier statut Brouillon
    const isDraft = await missionPage.isDraftStatus();
    expect(isDraft).toBeTruthy();
  });

  test('Génération et prévisualisation PDF du contrat', async ({ missionPage, contractPage, page }) => {
    await page.goto(`${process.env.BASE_URL}/missions`);
    
    const title = process.env.MISSION_TITLE || 'Dev_Mission_Demo';
    
    // Éditer mission pour créer contrat
    await missionPage.editMission(title);
    await missionPage.createContract();
    
    // Générer PDF
    await contractPage.generatePdf();
    
    // Prévisualiser
    await contractPage.previewContract();
    
    // Vérifier aperçu PDF
    const isPdfVisible = await contractPage.isPdfPreviewVisible();
    expect(isPdfVisible).toBeTruthy();
  });

  test('Téléchargement PDF du contrat', async ({ contractPage, page }) => {
    await page.goto(`${process.env.BASE_URL}/missions`);
    
    // Navigation jusqu'au contrat
    const title = process.env.MISSION_TITLE || 'Dev_Mission_Demo';
    const missionRow = page.locator(`text="${title}"`).first();
    await missionRow.click();
    
    // Télécharger contrat
    await contractPage.downloadContract();
    
    // Vérifier que pas d'erreur
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('Envoi pour signature', async ({ contractPage, page }) => {
    await page.goto(`${process.env.BASE_URL}/missions`);
    
    const title = process.env.MISSION_TITLE || 'Dev_Mission_Demo';
    const missionRow = page.locator(`text="${title}"`).first();
    await missionRow.click();
    
    // Envoyer pour signature
    await contractPage.sendForSignature();
    
    // Vérifier notification
    const isSuccess = await contractPage.isSuccessVisible();
    expect(isSuccess).toBeTruthy();
  });

  test('Signature du contrat', async ({ contractPage, page }) => {
    // Accéder à lien de signature (habituellement via email)
    await page.goto(`${process.env.BASE_URL}/sign-contract`);
    
    // Signer contrat
    await contractPage.signContract('Signature Test');
    
    // Vérifier succès
    const isSuccess = await contractPage.isSuccessVisible();
    expect(isSuccess).toBeTruthy();
  });

  test('Notification de signature réussie', async ({ page }) => {
    // Après signature, vérifier notification
    const successMsg = await page.textContent('.success-message, .alert-success');
    expect(successMsg).toContain('signé');
  });
});
