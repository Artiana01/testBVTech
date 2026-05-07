import { test, expect } from '../fixtures/fixtures';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('E2E-03 — Création Projet + Client', () => {
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

  test('Création projet avec nouveau client', async ({ clientPage, page }) => {
    // Aller au menu clients
    await clientPage.goToClients();
    
    // Créer projet
    const projectName = process.env.NEW_PROJECT_NAME || 'Developpement_Tech_Demo';
    const clientEmail = process.env.NEW_CLIENT_EMAIL || 'harivola3518@gmail.com';
    
    await clientPage.createProject(projectName, clientEmail);
    
    // Vérifier succès
    const isSuccess = await clientPage.isSuccessVisible();
    expect(isSuccess).toBeTruthy();
  });

  test('Détection client existant (HariEngin)', async ({ clientPage, page }) => {
    await clientPage.goToClients();
    
    // Essayer de créer avec email connu
    await clientPage.createProject('Test Project', 'harivola@existing.test');
    
    // Vérifier détection client existant
    const isExisting = await clientPage.isExistingClientDetected();
    expect(isExisting).toBeTruthy();
  });

  test('Projet créé automatiquement lors de création client', async ({ projectPage, page }) => {
    await page.goto(`${process.env.BASE_URL}/clients`);
    
    // Créer projet → client créé automatiquement
    const projectName = `Test_${Date.now()}`;
    const clientEmail = `client_${Date.now()}@test.test`;
    
    await projectPage.createProject(projectName, clientEmail);
    
    // Vérifier création
    const isVisible = await projectPage.isProjectVisible(projectName);
    expect(isVisible).toBeTruthy();
  });

  test('Client visible dans liste', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/clients`);
    
    // Vérifier que la liste est chargée
    const clientList = await page.$('[class*="client"]');
    expect(clientList).toBeTruthy();
  });
});
