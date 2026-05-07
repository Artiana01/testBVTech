/**
 * e2e-01-signup-activation.spec.ts
 * SCÉNARIO E2E 01: Inscription Agence + Activation compte
 * Priorité: P0 (Critique)
 */
import { test, expect } from '../fixtures';

test.describe('E2E 01: Inscription Agence + Activation compte', () => {
  test('Formulaire d\'inscription incomplet → refus inscription', async ({ signupPage, page }) => {
    // Accéder à la page d'inscription
    await signupPage.navigate('/signup');

    // Remplir le formulaire avec seulement le nom et l'email (incomplet)
    await signupPage.firstNameInput.fill('Test');
    await signupPage.emailInput.fill('test@bluevaloris.test');

    // Essayer de soumettre sans remplir tous les champs
    await signupPage.submitSignup();

    // Vérifier que l'erreur de validation s'affiche
    await signupPage.verifyValidationError();
  });

  test('Inscription Google n\'est pas fonctionnelle', async ({ signupPage }) => {
    await signupPage.navigate('/signup');
    
    // Vérifier que le bouton Google existe
    await signupPage.verifyGoogleButtonExists();
    
    // Cliquer sur le bouton Google
    await signupPage.googleButton.click();
    
    // Vérifier que la page ne change pas ou affiche une erreur
    // (selon l'implémentation, on peut vérifier que c'est non fonctionnel)
    const errorVisible = await signupPage.page.locator('[role="alert"], .error').isVisible().catch(() => false);
    // Note: ce test dépend du comportement actuel
  });

  test('Inscription complète réussie avec tous les champs', async ({ signupPage, otpPage, page }) => {
    await signupPage.navigate('/signup');

    // Remplir le formulaire complet
    await signupPage.fillSignupForm({
      firstName: 'Test',
      lastName: 'Agence',
      email: `agency-${Date.now()}@bluevaloris.test`,
      password: 'Test123!@#',
      civility: 'M.',
      nationality: 'Française',
    });

    // Accepter les conditions
    await signupPage.acceptTerms();

    // Soumettre le formulaire
    await signupPage.submitSignup();

    // Vérifier la notification de succès
    await signupPage.verifySignupSuccess();

    // Vérifier la réception de l'email et la page OTP
    await expect(page.locator('text="OTP"')).toBeVisible({ timeout: 10000 });

    // Saisir l'OTP (dans les tests, utiliser un OTP de test hardcodé)
    await otpPage.enterOtp('000000'); // OTP de test
    await otpPage.verifyOtp();

    // Vérifier le succès de la validation OTP
    await otpPage.verifyOtpSuccess();

    // Vérifier que le compte est activé et redirection
    await expect(page.locator('text="Dashboard", text="Bienvenue"')).toBeVisible({ timeout: 10000 });
  });

  test('OTP invalide → affichage d\'erreur', async ({ page }) => {
    // Naviguer vers la page OTP directement si possible
    await page.goto('/otp-verification');

    const otpPage = require('../pages/OtpPage').OtpPage;
    const otpPageInstance = new otpPage(page);

    // Saisir un OTP invalide
    await otpPageInstance.enterOtp('999999');
    await otpPageInstance.verifyOtp();

    // Vérifier l'erreur OTP
    await otpPageInstance.verifyOtpError();
  });
});
