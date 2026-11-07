# 📋 Passation de Session & Suivi Technique (passation.md)

Ce document sert de **mémoire persistante inter-sessions** basée sur les principes **ECC (Evidence-based Agentic Coding) & Graphify**.
Il retrace l'historique d'exécution exact, les décisions architecturales prises, l'état validé par tests et la feuille de route des fonctionnalités à implémenter.

---

## 📅 Dernière Mise à Jour : 7 Novembre 2026 (13:15 UTC)

---

## 🧭 Graphe de Connaissances & Dépendances du Projet (Graphify)

```
[Supabase Backend] ◄── RLS / Schema / Storage
      ▲
      │ (API REST & Realtime)
      ├─────────────────────────────────────────┐
      │                                         │
[Storefront Web (Next.js 15)]       [Admin Mobile (Expo SDK 52)]
├── Tailwind CSS v4                  ├── Expo Router v4 (file-based)
├── OrderTunnel (WhatsApp)           ├── Hooks Custom ECC (@/hooks/*)
└── ContentBlockRenderer             ├── Design Tokens (@/constants/theme)
                                     ├── Composants UI Atomiques (@/components/ui/*)
                                     └── EAS Build (APK Standalone Android)
```

---

## 🛠️ Journal des Interventions Récentes & Corrections Critiques

### 1. Résolution de l'Échec EAS Build Android (#6 & #7)
* **Problème 1 (Metro Root Resolution) :** Expo Router cherchait `app/` à la racine, or les routes se trouvent dans `src/app/`.
  * *Correction :* Création de `babel.config.js` avec `module-resolver`, `metro.config.js` avec alias `@/*` pointant sur `src/`, et ajout de `"root": "./src/app"` dans `app.json`.
* **Problème 2 (Package manquant pour le pré-build) :** EAS Build signalait `The required package expo-asset cannot be found`.
  * *Correction :* Installation officielle de `expo-asset` avec intégration de son config plugin.
* **Problème 3 (Incompatibilité Regex Hermes) :** Échec de compilation du bytecode JS avec `hermesc` (`Invalid flags /.../v` dans `query-string v9`).
  * *Correction :* Installation de `query-string@7.1.3` (100% compatible avec le moteur Hermes).
* **Preuve de validation locale :** Exécution réussie de `npx expo export --platform android` générant l'archive hermes bytecode de 5.24 MB sans aucun avertissement bloquant.

### 2. Refactorisation ECC de l'Application Mobile
* **Centralisation Design Impeccable UI/UX Pro Max :**
  * Création de `src/constants/theme.ts` définissant la palette monochrome chaude (`#060501`, `#100e04`, `#18160a`, `#facc15`, `#38bdf8`, `#4ade80`, `#ef4444`) et les métriques de grille.
* **Composants d'Interface Réutilisables (`src/components/ui/`) :**
  * `LoadingScreen`, `EmptyState`, `StatusBadge`, `FormField`, `StatCard`.
* **Découplage Logique Métier via Hooks Custom (`src/hooks/`) :**
  * `useProducts.ts` : cycle de vie des produits, bascule de visibilité, suppression avec confirmation.
  * `useOrders.ts` : gestion des commandes reçues et mise à jour des statuts.
  * `useSettings.ts` : chargement et sauvegarde sécurisée avec validation des retours d'erreurs.
* **Documentation & Règles Agents :**
  * Création de [`CLAUDE.md`](file:///home/menma/Shop%20Project/menma-store-app/CLAUDE.md) à la racine de l'app mobile.

### 3. Résolution des Conflits Git avec `origin/main`
* Fusion propre avec la branche `main` qui avait reçu la PR `#10`.
* Intégration harmonieuse des fonctions de formatage de date (`formatDate`) et de déconnexion sécurisée (`signOut` Supabase).

---

## 🎯 Feuille de Route : Nouvelles Fonctionnalités à Implémenter (ECC Workflow)

Les tâches suivantes doivent respecter le workflow **Eval-First & TDD** préconisé par ECC :

### Phase 1 : Expérience Mobile Admin (Priorité Haute)
- [ ] **Notifications Push & Sonores lors d'une nouvelle commande :**
  * Intégration de `expo-notifications` avec trigger Supabase Database Webhook ou écoute Realtime Supabase (`supabase.channel('orders')`).
  * Alerte sonore distincte à l'arrivée d'une commande "nouveau".
- [ ] **Filtres et Recherche Instantanée des Commandes :**
  * Onglets de filtre par statut (`Toutes`, `Nouvelles`, `Confirmées`, `Livrées`, `Annulées`).
  * Recherche par nom de client ou nom de produit dans `useOrders`.
- [ ] **Statistiques Avancées sur le Dashboard :**
  * Chiffre d'affaires filtrable par période (Aujourd'hui, 7 jours, Ce mois).
  * Indicateur des produits en rupture de stock (`stock === 0`).

### Phase 2 : Expérience Client Web & Conversion (Priorité Moyenne)
- [ ] **Revue et Notation Client (Avis vérifiés) :**
  * Ajout d'une table `reviews` sur Supabase avec modération admin dans l'app mobile.
- [ ] **Bannière d'Urgence / Compte à Rebours Promotionnel :**
  * Bloc configurable dans `settings` (titre, date de fin, réduction) avec affichage persistant en haut du storefront.
- [ ] **Partage Facilité du Lien Boutique :**
  * Bouton "Partager ma boutique" dans les réglages de l'app mobile (génération de QR Code direct et lien d'accès).

---

## 🔒 Règles pour la Prochaine Session
1. **Toujours tester avant de push :** Exécuter `npx tsc --noEmit` et `npx expo export --platform android` (ou web) avant tout commit.
2. **Ne jamais hardcoder de couleurs :** Utiliser systématiquement les tokens de [`src/constants/theme.ts`](file:///home/menma/Shop%20Project/menma-store-app/src/constants/theme.ts).
3. **Conserver l'architecture en hooks séparés :** Aucun appel API direct ou state complexe au sein des composants visuels d'écran.
