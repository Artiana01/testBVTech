# BV Portage - Suite de Tests E2E

Suite complète de tests end-to-end pour la plateforme **BV Portage** côté agence.

## 📋 Scénarios couverts (8 E2E)

### E2E 01: Inscription Agence + Activation compte (P0 - Critique)
- ✅ Formulaire incomplet → refus inscription
- ✅ Inscription Google non fonctionnelle (bloquant)
- ✅ Inscription complète réussie
- ✅ OTP invalide → erreur

### E2E 02: Connexion + Souscription Pack (P0 - Critique)
- ✅ Connexion et accès dashboard agence
- ✅ Sélection pack Agency 159€
- ✅ Paiement réussi
- ✅ Email de confirmation + pack activé

### E2E 03: Création Client + Projet (P0 - Critique)
- ✅ Création client avec tous les champs
- ✅ Création échoue avec email seul (point critique)
- ✅ Projet créé et associé
- ✅ Visible dans admin

### E2E 04: Mission + Contrat + KYC (P0 - Critique)
- ✅ Créer nouvelle mission
- ✅ Créer contrat avec profil agence
- ✅ Soumettre et valider KYC
- ✅ KYC validé par admin → notification + email
- ✅ KYC non validé → processus bloquant

### E2E 05: Signature Contrat (P0 - Critique)
- ✅ Générer et prévisualiser contrat
- ✅ Télécharger le contrat
- ✅ Envoyer pour signature et signer
- ✅ Email de confirmation

### E2E 06: Facturation + Paiement Client (P0 - Critique)
- ✅ Générer facture pour mission
- ✅ Récupérer lien de paiement
- ✅ Client effectue paiement par carte
- ✅ Email de confirmation
- ✅ Paiement refusé → erreur

### E2E 07: Invitation membre équipe (P1 - Important)
- ✅ Inviter nouveau membre
- ✅ Email d'invitation reçu
- ✅ Formulaire d'inscription spécial (mention invitation agence)
- ✅ Nouveau membre créé et rattaché

### E2E 08: Reversement (P1 - Important)
- ✅ Paiement validé → attente 72h → reversement
- ✅ Historique des reversements
- ✅ Montant conforme au paiement
- ✅ Notification de reversement effectué

## 🚀 Installation

```bash
cd e2e-tests/apps/bvportage

# Copier le fichier .env
cp .env.example .env

# Installer les dépendances (si nécessaire)
npm install
```

## 🔐 Identifiants de test

```
Admin:       admin@bluevaloris.test / Admin123!
Agence:      agency@bluevaloris.test / Agency123!
Freelancer:  freelancer@bluevaloris.test / Freelance123!
Client:      client@bluevaloris.test / Client123!
```

## ▶️ Exécution des tests

### Tous les tests
```bash
npx playwright test --config=playwright.bvportage.config.ts
```

### Tests spécifiques
```bash
# E2E 01 - Inscription
npx playwright test --config=playwright.bvportage.config.ts e2e-01-signup

# E2E 02 - Login et Pack
npx playwright test --config=playwright.bvportage.config.ts e2e-02-login

# E2E 06 - Facturation
npx playwright test --config=playwright.bvportage.config.ts e2e-06-invoice
```

### Mode debug
```bash
npx playwright test --config=playwright.bvportage.config.ts --debug
```

### Mode UI (recommandé)
```bash
npx playwright test --config=playwright.bvportage.config.ts --ui
```

## 📊 Rapports

Le rapport HTML est généré automatiquement:
```bash
playwright show-report playwright-report-bvportage
```

## 📁 Structure des fichiers

```
bvportage/
├── auth/                    # Fichiers d'authentification
│   ├── admin.json
│   ├── agency.json
│   └── freelancer.json
├── pages/                   # Page Objects
│   ├── SignupPage.ts
│   ├── LoginPage.ts
│   ├── OtpPage.ts
│   ├── AgencyDashboardPage.ts
│   ├── PackPage.ts
│   ├── ClientPage.ts
│   ├── MissionPage.ts
│   ├── TeamPage.ts
│   ├── ContractPage.ts
│   ├── KycPage.ts
│   ├── InvoicePage.ts
│   ├── PaymentPage.ts
│   └── AdminDashboardPage.ts
├── tests/                   # Tests E2E
│   ├── e2e-01-signup-activation.spec.ts
│   ├── e2e-02-login-pack-subscription.spec.ts
│   ├── e2e-03-client-creation.spec.ts
│   ├── e2e-04-mission-contract-kyc.spec.ts
│   ├── e2e-05-contract-signature.spec.ts
│   ├── e2e-06-invoice-payment.spec.ts
│   ├── e2e-07-team-invitation.spec.ts
│   └── e2e-08-reversal.spec.ts
├── fixtures.ts              # Fixtures personnalisées
├── global-setup.ts          # Configuration globale
├── .env                     # Variables d'environnement (à configurer)
└── .env.example             # Exemple de configuration
```

## 🔧 Configuration

Modifier le fichier `.env` pour adapter les paramètres:

```env
BASE_URL=https://dev.bluevalorisportage.com
ADMIN_EMAIL=admin@bluevaloris.test
ADMIN_PASSWORD=Admin123!
# etc...
```

## ⚠️ Points bloquants identifiés

| ID | Problème | Impact | Priorité |
|----|----------|--------|----------|
| B1 | Inscription Google non fonctionnelle | UX bloquante | P0 |
| B2 | Client impossible avec email seul | Différence avec freelance | P0 |
| B3 | Dépendance KYC | Bloque tout après | P0 |
| B4 | Différence flow freelance/agence | Incohérence produit | P0 |

## 📝 Notes importantes

- ⏱️ Attendre 72h pour tester le reversement en production
- 📧 Vérifier les mails en production (mailbox de test)
- 🔗 Les liens d'invitation utilisent des tokens temporaires
- 💳 Utiliser des cartes de test Stripe: 4242 4242 4242 4242
- 📄 Les documents KYC peuvent être simulés dans les tests

## 📞 Support

En cas de problème:
1. Consulter les logs dans `playwright-report-bvportage/`
2. Exécuter en mode debug: `--debug`
3. Vérifier les identifiants dans `.env`
4. Vérifier la disponibilité du serveur
