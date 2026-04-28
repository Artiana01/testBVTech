/**
 * apps/emiragate/global-setup.ts
 * --------------------------------
 * Exécuté UNE SEULE FOIS avant tous les tests Emiragate (BV Install).
 *
 * But : se connecter admin + client, sauvegarder les sessions.
 * URL de base : https://dev.bluevalorisinstall.com  (préfixe /en/)
 *
 * Sur Railway : si EMIRAGATE_ADMIN_SESSION est définie (base64 admin.json),
 *   on l'écrit et on saute la validation navigateur.
 */

import { chromium, FullConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL     = process.env.EMIRAGATE_BASE_URL      ?? 'https://dev.bluevalorisinstall.com';
const ADMIN_EMAIL  = process.env.EMIRAGATE_ADMIN_EMAIL   ?? '';
const ADMIN_PASS   = process.env.EMIRAGATE_ADMIN_PASSWORD ?? '';
const CLIENT_EMAIL = process.env.EMIRAGATE_CLIENT_EMAIL  ?? '';
const CLIENT_PASS  = process.env.EMIRAGATE_CLIENT_PASSWORD ?? '';

const AUTH_DIR       = path.resolve(__dirname, 'auth');
const ADMIN_SESSION  = path.join(AUTH_DIR, 'admin.json');
const CLIENT_SESSION = path.join(AUTH_DIR, 'client.json');

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
    await page.goto(`${BASE_URL}/en/login`);
    await page.waitForLoadState('load');

    // Certains apps ont /login, d'autres /signin — attendre l'un ou l'autre
    const emailInput = page.locator('input[type="email"], input[name*="email" i]');
    await emailInput.first().waitFor({ state: 'visible', timeout: 15_000 });

    await emailInput.first().fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(
      (url) => !url.toString().includes('/login') && !url.toString().includes('/signin'),
      { timeout: 30_000 }
    );

    await context.storageState({ path: sessionFile });
    console.log(`   ✅  Session ${label} sauvegardée → ${path.basename(sessionFile)}`);
    await page.close();
    return true;

  } catch (err) {
    const url = page.url();
    console.warn(`   ⚠️  Connexion ${label} échouée (URL actuelle : ${url})`);

    const isRateLimit = await page
      .getByText(/too many|trop de|limit|rate/i)
      .isVisible()
      .catch(() => false);

    if (isRateLimit) {
      console.warn('   🚫  Rate limiting détecté. Attente 60s puis nouvel essai...');
      await page.waitForTimeout(60_000);
      try {
        await page.goto(`${BASE_URL}/en/login`);
        await page.waitForLoadState('load');
        await page.locator('input[type="email"]').fill(email);
        await page.locator('input[type="password"]').fill(password);
        await page.locator('button[type="submit"]').click();
        await page.waitForURL(
          (url) => !url.toString().includes('/login'),
          { timeout: 30_000 }
        );
        await context.storageState({ path: sessionFile });
        console.log(`   ✅  Session ${label} sauvegardée (2e essai)`);
        await page.close();
        return true;
      } catch {
        console.warn(`   ❌  Échec persistant pour ${label}.`);
      }
    }

    await page.close();
    return false;
  }
}

export default async function globalSetup(_config: FullConfig) {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  // Railway : charger session admin depuis variable d'environnement
  const adminSessionEnv = process.env.EMIRAGATE_ADMIN_SESSION;
  if (adminSessionEnv) {
    try {
      const decoded = Buffer.from(adminSessionEnv, 'base64').toString('utf-8');
      const sessionData = JSON.parse(decoded);
      fs.writeFileSync(ADMIN_SESSION, decoded, 'utf-8');

      const now = Date.now() / 1000;
      const cookies: Array<{ name?: string; expires?: number }> = sessionData.cookies ?? [];
      const tokenCookie = cookies.find((c) =>
        c.name === 'token' || c.name === 'session' || c.name === 'access_token'
      );
      if (tokenCookie && tokenCookie.expires && tokenCookie.expires > 0 && tokenCookie.expires < now) {
        console.log('   ⚠️   Token expiré dans EMIRAGATE_ADMIN_SESSION. Renouveler la session.');
      } else {
        console.log('   📦  Session admin chargée depuis EMIRAGATE_ADMIN_SESSION (Railway).');
        console.log('   ✅  Lancement des tests...\n');
        return;
      }
    } catch {
      console.log('   ⚠️   EMIRAGATE_ADMIN_SESSION invalide — ignorée.');
    }
  }

  if (!ADMIN_EMAIL || !ADMIN_PASS) {
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  ⚠️   IDENTIFIANTS ADMIN MANQUANTS');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  Renseignez EMIRAGATE_ADMIN_EMAIL et EMIRAGATE_ADMIN_PASSWORD');
    console.log('  dans apps/emiragate/.env puis relancez les tests.');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log('  ℹ️   Les tests publics (SC-04, SC-05 form) peuvent démarrer.');
    console.log('      Les tests admin/client seront en échec.\n');
    return;
  }

  const browser = await chromium.launch({ headless: true });

  // === SESSION ADMIN ===
  {
    const ctx = await browser.newContext();
    await loginAndSave(ctx, ADMIN_EMAIL, ADMIN_PASS, ADMIN_SESSION, 'Admin');
    await ctx.close();
  }

  // === SESSION CLIENT ===
  if (CLIENT_EMAIL && CLIENT_PASS) {
    await new Promise((r) => setTimeout(r, 5_000));
    const ctx = await browser.newContext();
    await loginAndSave(ctx, CLIENT_EMAIL, CLIENT_PASS, CLIENT_SESSION, 'Client');
    await ctx.close();
  } else {
    console.log('\n   ℹ️   Pas de compte client configuré (EMIRAGATE_CLIENT_EMAIL/PASSWORD).');
  }

  await browser.close();
  console.log('\n🚀  Sessions prêtes. Lancement des tests Emiragate...\n');
}
