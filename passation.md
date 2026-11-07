# 📋 Passation de Session & Suivi Technique (passation.md)

Ce document sert de **mémoire persistante entre chaque session d'IA et de développement**.
Il récapitule l'historique complet, l'état exact du projet, ce qui a été achevé, et la feuille de route des tâches restantes.

---

## 📅 Dernière Mise à Jour : 7 Novembre 2026 (02:10 UTC)

---

## 🎯 Objectif du Projet
Créer un écosystème e-commerce auto-hébergé (**Easy-Store**) sans dépendance multi-tenant SaaS, composé de :
1. **Un Storefront Web (Next.js)** déployable sur Vercel avec rendu modulaire de blocs de vente (copywriting Maestro) et tunnel WhatsApp.
2. **Une Application Mobile Admin (React Native Expo)** permettant au propriétaire de connecter sa propre instance Supabase ("Bring-Your-Own-Supabase"), d'ajouter/ordonner des blocs de contenu et de piloter les commandes.

---

## 🚀 Référentiels Git & Branches Dédiées par Problème

### Storefront Web (`Dr-Djibi/Easy-Store`)
| Branche | Statut | Description |
|---|---|---|
| `main` | Stable | Branche de production |
| `feat/impeccable-ui-ux` | Base | Branche de fonctionnalités UX / UI |
| `fix/postcss-tailwind-config` | ✅ Prêt | Ajout de `postcss.config.mjs` pour la compilation Tailwind CSS v4 |
| `fix/supabase-resilience` | ✅ Prêt | Sécurisation des clients Supabase avec placeholders (évite les crashs de build) |
| `fix/product-page-errors` | ✅ Prêt | Gestion try-catch et `.maybeSingle()` sur `/produit/[slug]` |
| `fix/settings-and-utils-robustness` | ✅ Prêt | Sécurisation templating WhatsApp, parsing `ORDER_FIELDS` et UUID commande |
| `feat/out-of-stock-handling` | ✅ Prêt | Gestion dynamique du stock épuisé dans `OrderTunnel` avec CTA réassort |

### Application Mobile Admin (`Dr-Djibi/Easy-Store-App`)
| Branche | Statut | Description |
|---|---|---|
| `main` | Stable | Branche de production |
| `feat/apk-eas-workflow` | Base | Workflow CI/CD GitHub Actions & configuration EAS APK |
| `fix/eas-android-package-id` | ✅ Prêt | Ajout de `package: com.menmastore.admin` dans `app.json` requis par EAS Build |
| `fix/startup-race-condition` | ✅ Prêt | Ajout du drapeau `isReady` dans `useSupabaseStore` (fin des faux redirects `/config`) |
| `fix/admin-dashboard-styles` | ✅ Prêt | Remplacement de `fontWeight: 'black'` par `'900'`, dates déterministes et badges |
| `fix/admin-settings-and-logout` | ✅ Prêt | Appel explicite de `client.auth.signOut()`, retour d'erreur précis et pré-remplissage |
| `feat/native-image-upload` | ✅ Prêt | Intégration de `expo-image-picker` pour l'upload direct vers Supabase Storage |

---

## ✅ Ce qui est Fait et Validé

### 1. Base de Données & Schéma Supabase (`supabase/schema.sql`)
- [x] Table `products` avec champ `content_blocks JSONB` pour supporter les blocs modulaires.
- [x] Table `orders` pour enregistrer l'historique des commandes avec champs dynamiques `fields_data JSONB`.
- [x] Table `settings` pour la configuration boutique (Nom, Logo, WhatsApp, Devise, Textes, Thème).
- [x] Politiques de sécurité **Row Level Security (RLS)** actives :
  - Lecture publique limitée aux produits actifs (`actif = true`).
  - Insertion publique autorisée pour les commandes visiteurs.
  - CRUD et administration réservés à l'admin authentifié (`auth.role() = 'authenticated'`).
- [x] Configuration des buckets Supabase Storage (`products` et `assets`) avec leurs politiques d'accès.

### 2. Storefront Web (`menma-store` -> `Easy-Store`)
- [x] Architecture Next.js 15 App Router avec TailwindCSS v4 et variables de thèmes CSS.
- [x] **En-têtes de sécurité HTTP** configurés dans [`src/middleware.ts`](file:///home/menma/Shop%20Project/menma-store/src/middleware.ts).
- [x] **Composants d'accueil** : `HeroBanner`, `ProductGrid`, `ProductCard`, `ReassuranceBar`.
- [x] **Page Produit `/produit/[slug]`** :
  - Galerie photos interactive.
  - Tunnel de commande `OrderTunnel` : double mode (Direct WhatsApp ou Formulaire dynamique vers WhatsApp).
  - Composant `ContentBlockRenderer` : rendu ordonné des blocs personnalisés [Titre + Paragraphe + Image].
- [x] **Page Contact `/contact`** : Coordonnées, bouton WhatsApp direct, formulaire instantané.
- [x] Routes API Next.js :
  - `POST /api/orders` : enregistre la commande en base Supabase.
  - `GET /api/products` : expose les produits actifs.

### 3. Application Mobile Admin (`menma-store-app` -> `Easy-Store-App`)
- [x] Structure Expo Router avec thème sombre soigné.
- [x] Écran de liaison dynamique **`config.tsx`** : saisie et test en temps réel.
- [x] Écran de connexion admin **`login.tsx`** (Supabase Auth).
- [x] Navigation par onglets `(admin)` :
  - **Tableau de bord** : Statistiques réelles (Total produits, commandes, chiffre d'affaires).
  - **Gestion des Produits** : Liste avec toggle visibilité, suppression et redirection édition.
  - **Formulaire Produit (`nouveau.tsx` et `[id].tsx`)** : Titre, prix, stock, description, image avec sélecteur natif.
  - **Composant `BlockEditor.tsx`** : Ajout illimité de blocs avec boutons pour monter, descendre, supprimer et uploader.
  - **Gestion des Commandes** : Liste des commandes avec badge de statut et mise à jour.
  - **Réglages** : Modification de la boutique et déconnexion sécurisée.

### 4. Automatisation CI/CD & Build APK
- [x] Création du fichier [`eas.json`](file:///home/menma/Shop%20Project/menma-store-app/eas.json) configuré pour générer des fichiers **APK directs** (`buildType: "apk"` pour les profils `preview` et `production`).
- [x] Création du workflow GitHub Actions [`.github/workflows/eas-build.yml`](file:///home/menma/Shop%20Project/menma-store-app/.github/workflows/eas-build.yml) permettant de lancer la compilation de l'APK manuellement via GitHub Actions (`workflow_dispatch`) ou lors de la publication d'un tag/release.
- [x] Création du workflow OTA [`.github/workflows/eas-update.yml`](file:///home/menma/Shop%20Project/menma-store-app/.github/workflows/eas-update.yml) pour déployer les mises à jour en direct sans recompiler l'APK.

---

## ⏳ Ce qu'il Reste à Faire (Roadmap & Prochaines Étapes)

### Étape 1 : Exécution côté utilisateur (Pré-requis Déploiement)
- [ ] Exécuter le script [`supabase/schema.sql`](file:///home/menma/Shop%20Project/supabase/schema.sql) dans le SQL Editor de Supabase.
- [ ] Créer l'utilisateur administrateur dans **Supabase > Authentication > Users**.
- [ ] Déployer le dépôt `Dr-Djibi/Easy-Store` sur **Vercel** avec les variables :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### Étape 2 : Améliorations Futures (sur les branches dédiées)
- [ ] **Notifications sonores / push** lors d'une nouvelle commande dans l'app mobile via Expo Notifications.
- [ ] **Recherche & Filtrage avancé** sur la grille de produits du site web (par mot-clé ou par catégorie si ajoutée).
- [ ] **Génération de tickets / reçus PDF** pour les commandes livrées.

---

## 📌 Règles de Travail pour les Futures Sessions d'IA
1. Toujours consulter ce fichier `passation.md` avant de démarrer toute intervention.
2. Travailler sur des branches au format `feat/...`, `style/...` ou `fix/...`. Ne jamais committer sur `main`.
3. Chaque problème ou fonctionnalité doit avoir sa propre branche dédiée.
4. Mettre à jour ce document à la fin de chaque session.
