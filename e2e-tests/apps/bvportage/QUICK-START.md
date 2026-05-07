# 🚀 Quick Start - BV Portage E2E Tests

## 1️⃣ Configuration initiale (2 min)

```bash
# Naviguer vers le dossier
cd d:\PLAYRIGHT\e2e-tests\apps\bvportage

# Vérifier que le .env est configuré
cat .env
```

Le `.env` contient déjà:
```
BASE_URL=https://dev.bluevalorisportage.com
ADMIN_EMAIL=admin@bluevaloris.test
ADMIN_PASSWORD=Admin123!
AGENCY_EMAIL=agency@bluevaloris.test
AGENCY_PASSWORD=Agency123!
# ... autres variables
```

## 2️⃣ Exécuter les tests (5 min)

### Option A: Mode UI (recommandé - visuel)
```bash
npx playwright test --config=../../playwright.bvportage.config.ts --ui
```
✅ Interface interactive, trace les étapes, capture les erreurs

### Option B: Mode terminal
```bash
npx playwright test --config=../../playwright.bvportage.config.ts
```
✅ Exécution rapide, rapport HTML généré

### Option C: Debug (troubleshooting)
```bash
npx playwright test --config=../../playwright.bvportage.config.ts --debug
```
✅ Contrôle pas à pas, inspect le DOM

## 3️⃣ Tests individuels

```bash
# Inscription uniquement
npx playwright test --config=../../playwright.bvportage.config.ts -g "E2E 01"

# Login + Pack
npx playwright test --config=../../playwright.bvportage.config.ts -g "E2E 02"

# Client
npx playwright test --config=../../playwright.bvportage.config.ts -g "E2E 03"
```

## 4️⃣ Consulter les résultats

```bash
# Voir le rapport HTML
npx playwright show-report ../../playwright-report-bvportage
```

## 📋 Scénarios exécutés

| # | Scénario | Cas testés | Priorité |
|---|----------|-----------|----------|
| E01 | Inscription + OTP | Formulaire complet, incomplet, Google, OTP | P0 |
| E02 | Login + Pack | Connexion, pack 159€, paiement | P0 |
| E03 | Client + Projet | Création complète, validation, email seul | P0 |
| E04 | Mission + KYC | Mission, contrat, KYC admin, rejet | P0 |
| E05 | Signature | Générer, prévisualiser, signer | P0 |
| E06 | Facturation | Facture, lien paiement, paiement | P0 |
| E07 | Équipe | Invitation, formulaire spécial | P1 |
| E08 | Reversement | Attente 72h, montant, historique | P1 |

## 🔑 Identifiants de test

```
ADMIN:       admin@bluevaloris.test / Admin123!
AGENCE:      agency@bluevaloris.test / Agency123!
FREELANCE:   freelancer@bluevaloris.test / Freelance123!
CLIENT:      client@bluevaloris.test / Client123!
```

## 💳 Cartes de test Stripe

| Cas | Carte | MM/YY | CVC |
|-----|-------|-------|-----|
| ✅ Succès | 4242 4242 4242 4242 | 12/25 | 123 |
| ❌ Refus | 4000 0000 0000 0002 | 12/25 | 123 |

## 🎯 Points clés à vérifier

- ✅ Google Sign-In → **NON FONCTIONNEL** (bloquant)
- ✅ Client email seul → **ÉCHOUE** (point critique)
- ✅ KYC → **VALIDE PAR ADMIN**
- ✅ Reversal → **ATTENTE 72H**
- ✅ Tous les emails reçus

## 📊 Structure des fichiers

```
bvportage/
├── fixtures.ts                          # Imports pages
├── global-setup.ts                      # Init globale
├── .env                                 # Config
├── pages/                               # 13 page objects
├── tests/                               # 8 scénarios E2E
└── SCENARIOS.md                         # Documentation détaillée
```

## ⚡ Conseils d'utilisation

1. **Première fois**: Utiliser mode `--ui` pour apprendre
2. **CI/CD**: Utiliser config `playwright.bvportage.config.ts`
3. **Débogage**: Ajouter `--debug` si test échoue
4. **Rapports**: Consulter `playwright-report-bvportage/`
5. **Mails**: Vérifier mailbox fournie pour confirmations

## 🐛 En cas de problème

```bash
# Vérifier la config
cat .env

# Vérifier le serveur
curl https://dev.bluevalorisportage.com

# Réinitialiser l'env
npm install

# Clean et recommencer
rm -rf node_modules
npm install
```

## 📞 Fichiers importants

- **Tests**: `apps/bvportage/tests/e2e-*.spec.ts`
- **Pages**: `apps/bvportage/pages/*.ts`
- **Config**: `playwright.bvportage.config.ts`
- **Scenarios**: `apps/bvportage/SCENARIOS.md`
- **Rapport**: `playwright-report-bvportage/index.html`

## ✅ Checklist avant lancement

- [ ] `.env` configuré avec les bonnes URLs
- [ ] Serveur `dev.bluevalorisportage.com` accessible
- [ ] Compte agence active sur la plateforme
- [ ] Playwright installé (`npm install`)
- [ ] Navigateur Chromium disponible

---

**À présent, lancez les tests!** 🎬
