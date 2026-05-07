import { test, expect } from '../fixtures/fixtures';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('E2E-01 — Inscription Freelance + OTP', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL || 'https://dev.bluevalorisportage.com');
  });

  test('CAS 1: Formulaire incomplet → refus', async ({ signupPage }) => {
    await signupPage.fillSignupForm('Test User', '', '');
    await expect(signupPage.page).toHaveURL(new RegExp('signup|inscription'), { timeout: 5000 });
  });

  test('CAS 2: Création de compte complet → OK', async ({ signupPage, page }) => {
    const email = process.env.NEW_FREELANCER_EMAIL || 'daniellah.freelance@test.test';
    const password = process.env.NEW_FREELANCER_PASSWORD || 'Daniellah3!';
    
    await signupPage.fillSignupForm('Daniellah', email, password);
    await signupPage.selectFreelance();
    await signupPage.submit();

    // Vérifier notification succès
    const isSuccess = await signupPage.isSuccessVisible();
    expect(isSuccess).toBeTruthy();
  });

  test('CAS 3: Email déjà utilisé → erreur', async ({ signupPage }) => {
    const email = process.env.FREELANCER_EMAIL || 'freelancer@bluevaloris.test';
    
    await signupPage.fillSignupForm('Test', email, 'TestPassword123!');
    await signupPage.selectFreelance();
    await signupPage.submit();

    const isError = await signupPage.isErrorVisible();
    expect(isError).toBeTruthy();
  });

  test('CAS 4: Même nom + email différent → OK', async ({ signupPage }) => {
    const email = `test.${Date.now()}@test.test`;
    
    await signupPage.fillSignupForm('Daniellah', email, 'TestPassword123!');
    await signupPage.selectFreelance();
    await signupPage.submit();

    const isSuccess = await signupPage.isSuccessVisible();
    expect(isSuccess).toBeTruthy();
  });
});

test.describe('E2E-01 — OTP Validation', () => {
  test('OTP reçu et validation OK', async ({ page }) => {
    // Accéder à la page OTP
    await page.goto(`${process.env.BASE_URL}/verify-otp`);
    
    // Attendre la présence du formulaire OTP
    await page.waitForSelector('input[inputmode="numeric"]', { timeout: 60000 });
    
    // Note: En test réel, on aurait accès au code OTP via email/SMS
    // Ici on teste la structure du formulaire
    const otpInputs = await page.$$('input[inputmode="numeric"]');
    expect(otpInputs.length).toBeGreaterThan(0);
  });
});
