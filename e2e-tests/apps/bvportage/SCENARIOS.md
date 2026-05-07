# BV Portage - Synthèse Complète des Tests E2E

## 👥 Profils utilisateurs

| Profil | Email | MDP | URL |
|--------|-------|-----|-----|
| Admin | admin@bluevaloris.test | Admin123! | https://dev.bluevalorisportage.com |
| Agence | agency@bluevaloris.test | Agency123! | https://dev.bluevalorisportage.com |
| Freelancer | freelancer@bluevaloris.test | Freelance123! | https://dev.bluevalorisportage.com |
| Client | client@bluevaloris.test | Client123! | https://dev.bluevalorisportage.com |

## 📊 User Flow - Processus Inscription Agence

```
1. INSCRIPTION AGENCE
   ├─ Accéder page d'inscription
   ├─ Remplir formulaire complet (Nom, email, MDP, civilité, nationalité)
   ├─ Valider le formulaire
   ├─ Notification: "Compte créé avec succès"
   ├─ Email reçu: Confirmation + OTP
   ├─ Saisir OTP
   └─ Vérifier OTP et compte activé

2. CONNEXION & CHOIX PROFIL
   ├─ Se connecter
   ├─ Choisir "Espace Agence"
   └─ Redirection Dashboard Agence

3. CHOIX & SOUSCRIPTION PACK
   ├─ Sélectionner pack "Agency (159€)"
   ├─ Effectuer paiement (carte Stripe)
   ├─ Paiement validé
   ├─ Activation du pack
   ├─ Email confirmation paiement
   └─ Redirection accueil

4. CRÉATION CLIENT
   ├─ Menu Client → Nouveau client
   ├─ Remplir formulaire complet:
   │  ├─ Nom client
   │  ├─ Entreprise
   │  ├─ Email
   │  └─ Titre projet
   ├─ Créer client + projet
   ├─ Notification: "Client créé"
   └─ Visible dans admin

5. CRÉATION MISSION
   ├─ Menu Mission → Nouvelle mission
   ├─ Saisir nom + description
   ├─ Validation
   └─ Notification: "Mission créée"

6. CONTRAT DE MISSION - ÉTAPE 1: PROFIL & KYC
   ├─ Menu Contrat
   ├─ Compléter profil agence (nom, adresse, téléphone)
   ├─ Soumettre KYC (documents):
   │  ├─ Document identité
   │  ├─ Justificatif adresse
   │  └─ Document professionnel
   ├─ Validation KYC côté ADMIN
   ├─ Statut: "Vérifié"
   ├─ Notification + email
   └─ Document KYC mis à jour

7. CONTRAT DE MISSION - ÉTAPE 2: VOIR VÉRIFICATION
   ├─ Afficher statut KYC
   └─ Vérifier "Vérifié"

8. CONTRAT DE MISSION - ÉTAPE 3: SIGNATURE
   ├─ Créer contrat (ref: BVP-2026-0019)
   ├─ Prévisualiser PDF
   ├─ Télécharger
   ├─ Envoyer pour signature
   ├─ Remplir formulaire signature
   ├─ Signature enregistrée
   ├─ Email: Contrat signé
   └─ Document contrat généré

9. FACTURATION
   ├─ Menu Facture
   ├─ Générer facture pour mission
   ├─ Sélectionner mission
   ├─ Notification: "Facture générée"
   ├─ Récupérer lien de paiement
   └─ Envoyer par message au client

10. PAIEMENT CLIENT
    ├─ Client reçoit lien facturation
    ├─ Accéder lien paiement
    ├─ Remplir infos carte:
    │  ├─ Numéro carte
    │  ├─ Date expiration
    │  ├─ CVC
    │  └─ Nom titulaire
    ├─ Paiement effectué
    ├─ Notification: "Paiement confirmé"
    └─ Email confirmation

11. REVERSEMENT
    ├─ Paiement validé
    ├─ Attente 72h
    ├─ Reversement effectué
    ├─ Email notification
    └─ Montant reçu sur compte

12. GESTION ÉQUIPE
    ├─ Menu Équipe
    ├─ Inviter nouveau membre
    ├─ Saisir email non existant
    ├─ Envoyer invitation
    ├─ Membre reçoit email
    ├─ Clic "Créer mon compte"
    ├─ Formulaire spécial (mention invitation agence)
    ├─ Création compte réussie
    └─ Membre rattaché à l'agence
```

## 🎯 Scénarios E2E Détaillés

### SCÉNARIO E2E 01: Inscription Agence + Activation
**Priorité**: P0 (Critique)  
**Dur**: ~15 min  
**Points testés**:
- ✅ Formulaire avec validation obligatoire (6 champs minimum)
- ✅ Erreur si formulaire incomplet
- ❌ Google Sign-In non fonctionnel (bloquant)
- ✅ OTP envoyé par email
- ✅ OTP validé → compte activé

**Cas d'erreur**:
- Formulaire incomplet → "Tous les champs sont obligatoires"
- OTP invalide → "Code invalide"
- OTP expiré → "Code expiré, renvoyer"

---

### SCÉNARIO E2E 02: Connexion + Pack Agence
**Priorité**: P0 (Critique)  
**Dur**: ~10 min  
**Points testés**:
- ✅ Login OK
- ✅ Choix "Espace Agence"
- ✅ Dashboard agence chargé
- ✅ Pack Agency 159€ sélectionnable
- ✅ Paiement Stripe OK
- ✅ Redirection dashboard après paiement

**Cas d'erreur**:
- Identifiants invalides → "Email ou mot de passe incorrect"
- Paiement refusé → "Carte refusée"

---

### SCÉNARIO E2E 03: Client + Projet
**Priorité**: P0 (Critique)  
**Dur**: ~12 min  
**Points testés**:
- ✅ Création client avec infos complètes
- ❌ Création échoue avec email seul (point critique)
- ✅ Projet automatiquement créé
- ✅ Visible dans admin

**Cas d'erreur**:
- Email seul → "Informations client incomplètes"

**Données de test**:
- Nom: Piso Rak
- Entreprise: Piso Company
- Email: client@company.test
- Projet: Developpement web test agence

---

### SCÉNARIO E2E 04: Mission + Contrat + KYC
**Priorité**: P0 (Critique)  
**Dur**: ~25 min  
**Points testés**:
- ✅ Mission créée avec nom
- ✅ Contrat créé avec profil agence
- ✅ KYC soumis (3 documents)
- ✅ Admin valide KYC
- ✅ Statut → "Vérifié"
- ✅ Email notification

**Données**:
- Mission: Dev Mission Agence
- Agence: PisoEngin
- Adresse: 123 Rue Test, 75000 Paris
- Téléphone: +33612345678

**Cas d'erreur**:
- KYC rejeté → "Documents insuffisants" → processus bloqué

---

### SCÉNARIO E2E 05: Signature Contrat
**Priorité**: P0 (Critique)  
**Dur**: ~15 min  
**Points testés**:
- ✅ Contrat généré avec ref (BVP-2026-0019)
- ✅ PDF prévisualisation
- ✅ Téléchargement PDF
- ✅ Signature numérique
- ✅ Statut → "Signé"
- ✅ Email confirmation

---

### SCÉNARIO E2E 06: Facturation + Paiement
**Priorité**: P0 (Critique)  
**Dur**: ~20 min  
**Points testés**:
- ✅ Facture générée
- ✅ Lien de paiement copié
- ✅ Client accède lien
- ✅ Paiement par carte Stripe
- ✅ Paiement validé
- ✅ Email confirmation
- ❌ Paiement refusé → erreur affichée

**Carte de test**: 4242 4242 4242 4242 | 12/25 | 123

---

### SCÉNARIO E2E 07: Invitation Équipe
**Priorité**: P1 (Important)  
**Dur**: ~12 min  
**Points testés**:
- ✅ Invitation envoyée à nouvel email
- ✅ Email reçu
- ✅ Formulaire d'inscription modifié (mention "invitation agence")
- ✅ Compte créé
- ✅ Membre apparaît dans équipe

---

### SCÉNARIO E2E 08: Reversement
**Priorité**: P1 (Important)  
**Dur**: ~5 min (+ attente 72h réelle)  
**Points testés**:
- ✅ Statut paiement "En attente" → "Reversement dans 72h"
- ✅ Historique reversements accessible
- ✅ Montant conforme (paiement - frais)
- ✅ Notification quand effectué

---

## 🗂️ Structure des fichiers créés

```
e2e-tests/
├── playwright.bvportage.config.ts          [NEW] Config Playwright
└── apps/bvportage/                         [NEW]
    ├── .env                                [NEW] Env variables
    ├── .env.example                        [NEW] Template env
    ├── package.json                        [NEW] Scripts NPM
    ├── README.md                           [NEW] Documentation
    ├── global-setup.ts                     [NEW] Setup global
    ├── fixtures.ts                         [NEW] Fixtures personnalisées
    ├── auth/
    │   ├── admin.json                      [NEW]
    │   ├── agency.json                     [NEW]
    │   └── freelancer.json                 [NEW]
    ├── pages/                              [NEW] Page Objects
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
    └── tests/                              [NEW] Tests E2E
        ├── e2e-01-signup-activation.spec.ts
        ├── e2e-02-login-pack-subscription.spec.ts
        ├── e2e-03-client-creation.spec.ts
        ├── e2e-04-mission-contract-kyc.spec.ts
        ├── e2e-05-contract-signature.spec.ts
        ├── e2e-06-invoice-payment.spec.ts
        ├── e2e-07-team-invitation.spec.ts
        └── e2e-08-reversal.spec.ts
```

## 🚀 Commandes de test

```bash
# Tous les tests
npm run test

# Tests avec UI interactive
npm run test:ui

# Mode debug
npm run test:debug

# Tests individuels
npm run test:signup
npm run test:login
npm run test:client
npm run test:mission
npm run test:contract
npm run test:invoice
npm run test:team
npm run test:reversal

# Voir rapport
npm run report
```

## ⚠️ Bloquants Identifiés

| ID | Problème | Impact | Statut |
|----|----------|--------|--------|
| B1 | Inscription Google non fonctionnelle | UX bloquante | ❌ À corriger |
| B2 | Client impossible avec email seul | Différence flows | ❌ À corriger |
| B3 | KYC bloque processus | Business bloquant | ⚠️ Normal |
| B4 | Flows différents agence/freelance | Incohérence | ❌ À unifier |

## 📝 Notes Importantes

1. **Authentification**: Les 3 profils (admin, agence, freelancer) testés
2. **KYC**: Processus bloquant attendu jusqu'à validation admin
3. **Reversal**: Attendre 72h en production réelle
4. **Mails**: Vérifier mailbox de test fournie
5. **Paiements**: Cartes Stripe de test utilisées
6. **Tokens**: Invitations utilisent tokens temporaires

## ✅ Statut global

- **Pages Objects**: ✅ 13 pages créées
- **Tests E2E**: ✅ 8 scénarios + cas d'erreur
- **Cas d'erreur**: ✅ Couverts dans chaque test
- **Configuration**: ✅ Prête à l'exécution
- **Documentation**: ✅ Complète
