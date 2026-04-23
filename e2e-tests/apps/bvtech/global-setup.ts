/**
 * apps/bvtech/global-setup.ts
 * ----------------------------
 * Exécuté UNE SEULE FOIS avant tous les tests BV Tech.
 *
 * But : se connecter en tant qu'admin (et client si possible),
 *       sauvegarder les sessions dans auth/admin.json et auth/client.json.
 *       Les tests réutilisent ces sessions via storageState → plus de rate limiting.
 *
 * Usage : npx playwright test --config=playwright.bvtech.config.ts
 */

import { chromium, FullConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL      = process.env.BASE_URL      ?? 'https://dev.bluevaloristech.com';
const ADMIN_EMAIL   = process.env.ADMIN_EMAIL   ?? 'webmaster@bluevaloris.com';
const ADMIN_PASS    = process.env.ADMIN_PASSWORD ?? '123456789Ca!';
const CLIENT_EMAIL  = process.env.TEST_EMAIL     ?? '';
const CLIENT_PASS   = process.env.TEST_PASSWORD  ?? '';

const AUTH_DIR = path.resolve(__dirname, 'auth');

async function loginAndSave(
  context: Awaited<ReturnType<typeof chromium.newContext>>,
  email: string,
  password: string,
  sessionFile: string,
  label: string
): Promise<boolean> {
  const page = await context.newPage();

  try {
    console.log(`\n🔐  Connexion ${label} (${email})...`);
    await page.goto(`${BASE_URL}/fr/login`);
    await page.waitForLoadState('load');
    await page.locator('input[type="email"]').waitFor({ state: 'visible', timeout: 15_000 });

    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.locator('button[type="submit"]').click();

    // Attendre la redirection hors de /login (30s max)
    await page.waitForURL(
      (url) => !url.toString().includes('/login'),
      { timeout: 30_000 }
    );

    // Sauvegarder la session (cookies + localStorage)
    await context.storageState({ path: sessionFile });
    console.log(`   ✅  Session ${label} sauvegardée → ${path.basename(sessionFile)}`);
    await page.close();
    return true;

  } catch (err) {
    const url = page.url();
    console.warn(`   ⚠️  Connexion ${label} échouée (URL actuelle : ${url})`);

    // Vérifier si c'est un rate limiting
    const isRateLimit = await page
      .getByText(/too many|trop de|limit|rate/i)
      .isVisible()
      .catch(() => false);

    if (isRateLimit) {
      console.warn('   🚫  Rate limiting détecté. Attente 60s puis nouvel essai...');
      await page.waitForTimeout(60_000);

      // Second essai
      try {
        await page.goto(`${BASE_URL}/fr/login`);
        await page.waitForLoadState('load');
        await page.locator('input[type="email"]').fill(email);
        await page.locator('input[type="password"]').fill(password);
        await page.locator('button[type="submit"]').click();
        await page.waitForURL(
          (url) => !url.toString().includes('/login'),
          { timeout: 30_000 }
        );
        await context.storageState({ path: sessionFile });
        console.log(`   ✅  Session ${label} sauvegardée (2e essai) → ${path.basename(sessionFile)}`);
        await page.close();
        return true;
      } catch {
        console.warn(`   ❌  Échec persistant pour ${label}. Session non sauvegardée.`);
      }
    }

    await page.close();
    return false;
  }
}

export default async function globalSetup(_config: FullConfig) {
  // Créer le dossier auth/
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  // === SESSION ADMIN ===
  {
    const ctx = await browser.newContext();
    await loginAndSave(ctx, ADMIN_EMAIL, ADMIN_PASS, path.join(AUTH_DIR, 'admin.json'), 'Admin');
    await ctx.close();
  }

  // === SESSION CLIENT (si credentials disponibles) ===
  if (CLIENT_EMAIL && CLIENT_PASS) {
    // Pause 5s entre les deux logins pour éviter le rate limiting
    await new Promise((r) => setTimeout(r, 5_000));

    const ctx = await browser.newContext();
    await loginAndSave(ctx, CLIENT_EMAIL, CLIENT_PASS, path.join(AUTH_DIR, 'client.json'), 'Client');
    await ctx.close();
  } else {
    console.log('\n   ℹ️   Pas de compte client configuré dans .env (TEST_EMAIL/TEST_PASSWORD)');
    console.log('       → Les tests client seront ignorés ou en mode dégradé.');
  }

  await browser.close();
  console.log('\n🚀  Sessions prêtes. Lancement des tests...\n');
}
