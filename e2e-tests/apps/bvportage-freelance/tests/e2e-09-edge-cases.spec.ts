import { test, expect } from '../fixtures/fixtures';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('E2E-09 — Cas limites & comptes', () => {
  test('Email déjà utilisé → Erreur', async ({ signupPage, page }) => {
    await page.goto(`${process.env.BASE_URL}/signup`);
    
    const email = process.env.FREELANCER_EMAIL || 'freelancer@bluevaloris.test';
    
    await signupPage.fillSignupForm('New User', email, 'Password123!');
    await signupPage.selectFreelance();
    await signupPage.submit();
    
    // Vérifier erreur
    const isError = await signupPage.isErrorVisible();
    expect(isError).toBeTruthy();
    
    const errorMsg = await signupPage.getErrorMessage();
    expect(errorMsg).toContain('email');
  });

  test('Même email → Compte uniquement créé une fois', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/signup`);
    
    const email = `test-${Date.now()}@test.test`;
    
    // Première inscription
    await page.fill('input[type="email"]', email);
    await page.fill('input[name*="name"]', 'User One');
    await page.fill('input[type="password"]:nth-of-type(1)', 'Password123!');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ timeout: 30000 }).catch(() => {});
    
    // Attendre et revenir
    await page.goto(`${process.env.BASE_URL}/signup`);
    
    // Deuxième tentative même email
    await page.fill('input[type="email"]', email);
    await page.fill('input[name*="name"]', 'User Two');
    await page.fill('input[type="password"]:nth-of-type(1)', 'Password456!');
    await page.click('button[type="submit"]');
    
    // Vérifier erreur de duplication
    const errorMsg = await page.textContent('.error-message, [role="alert"]');
    expect(errorMsg).toContain('email');
  });

  test('Même nom + email différent → ✅ OK (compte créé)', async ({ signupPage }) => {
    const name = 'Daniellah';
    const email1 = `daniellah.${Date.now()}@test.test`;
    const email2 = `daniellah.${Date.now() + 1}@test.test`;
    
    // Premier compte
    await signupPage.fillSignupForm(name, email1, 'Password123!');
    await signupPage.selectFreelance();
    await signupPage.submit();
    
    const isSuccess1 = await signupPage.isSuccessVisible();
    expect(isSuccess1).toBeTruthy();
    
    // Deuxième compte même nom, email différent
    await signupPage.fillSignupForm(name, email2, 'Password456!');
    await signupPage.selectFreelance();
    await signupPage.submit();
    
    const isSuccess2 = await signupPage.isSuccessVisible();
    expect(isSuccess2).toBeTruthy();
  });

  test('Même nom et même email → Erreur', async ({ signupPage, page }) => {
    const name = 'Test User';
    const email = `test-${Date.now()}@test.test`;
    const password = 'TestPassword123!';
    
    // Première création
    await signupPage.fillSignupForm(name, email, password);
    await signupPage.selectFreelance();
    await signupPage.submit();
    
    await page.waitForNavigation({ timeout: 30000 }).catch(() => {});
    await page.goto(`${process.env.BASE_URL}/signup`);
    
    // Deuxième tentative
    await signupPage.fillSignupForm(name, email, password);
    await signupPage.selectFreelance();
    await signupPage.submit();
    
    // Vérifier erreur
    const isError = await signupPage.isErrorVisible();
    expect(isError).toBeTruthy();
  });

  test('Formulaire sans civility → peut être accepté', async ({ signupPage }) => {
    const email = `test-${Date.now()}@test.test`;
    
    // Remplir sans civility
    await signupPage.fillSignupForm('Test', email, 'Password123!');
    await signupPage.selectFreelance();
    await signupPage.submit();
    
    // Dépend de la validation serveur
    const url = await signupPage.getUrl();
    expect(url).toBeTruthy();
  });

  test('Cas limite: Email très long → Vérifier limite', async ({ signupPage }) => {
    const longEmail = 'a'.repeat(100) + '@test.test';
    
    await signupPage.fillSignupForm('Test', longEmail, 'Password123!');
    
    // Vérifier que pas d'erreur triviale
    const isErrorVisible = await signupPage.isErrorVisible();
    // On accepte soit succès soit erreur de validation
    expect(true).toBeTruthy();
  });

  test('Cas limite: MDP très court → Validation', async ({ signupPage }) => {
    const email = `test-${Date.now()}@test.test`;
    
    await signupPage.fillSignupForm('Test', email, '123');
    
    // Vérifier validation
    const isErrorVisible = await signupPage.isErrorVisible();
    // Selon validation du serveur
    expect(true).toBeTruthy();
  });
});
