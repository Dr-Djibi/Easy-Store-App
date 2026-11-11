# 📄 PRD — Easyphy App Admin Mobile
> **Produit** : Easyphy — Application Admin Mobile Android  
> **Dépôt** : `menma-store-app/` (Expo SDK 52 / React Native 0.76.7)  
> **Dépôt lié** : `menma-store/` (Storefront Web + Admin Web Next.js — voir son propre PRD)  
> **Version** : 4.0.0 — Rebranding Easyphy + Features Africaines  
> **Date** : 11 Novembre 2026  
> **Marché cible** : Afrique Francophone (Guinée, Côte d'Ivoire, Sénégal, Mali, Cameroun, Bénin...)

---

## 1. 🎯 Vision Produit

L'application **Easyphy Admin** est l'interface de gestion mobile native pour les propriétaires de boutiques Easyphy. Elle permet au commerçant de gérer sa boutique depuis son smartphone Android, **même en mobilité**, avec des notifications push pour chaque nouvelle commande.

### Complémentarité avec le Storefront/Admin Web
| | App Mobile (`menma-store-app/`) | Admin Web (`menma-store/`) |
|---|---|---|
| **Usage principal** | Gestion rapide en déplacement, notifications push | Gestion complète depuis desktop |
| **Avantage clé** | Notifications push temps réel, touch-first, offline-ready | BlockEditor complet, ergonomie clavier |
| **Backend partagé** | ✅ Même instance Supabase BYO | ✅ Même instance Supabase BYO |

**Principe BYO (Bring Your Own Supabase)** : Le commerçant saisit ses propres clés Supabase dans l'app. Zéro dépendance à un SaaS tiers, zéro abonnement mensuel, données 100% propriétaires.

---

## 2. 🏗️ Architecture Technique

```
menma-store-app/ (CE DÉPÔT — App Admin Mobile Android)
└── src/
    ├── app/
    │   ├── index.tsx             → Routage initial (config → login → admin)
    │   ├── config.tsx            → Saisie URL + clé Supabase (1ère connexion)
    │   ├── login.tsx             → Authentification email/mot de passe Supabase
    │   └── (admin)/              → Groupe de routes protégées
    │       ├── _layout.tsx       → Tab bar flottante 4 onglets
    │       ├── index.tsx         → Dashboard (stats temps réel)
    │       ├── commandes/        → Gestion commandes
    │       ├── produits/         → Liste + CRUD produits
    │       └── reglages/         → Paramètres boutique
    ├── components/
    │   ├── ui/                   → LoadingScreen, EmptyState, StatusBadge, FormField, StatCard
    │   └── product/              → BlockEditor, RichTextEditor
    ├── constants/
    │   └── theme.ts              → Tokens design : couleurs, espacements, rayons, polices
    ├── hooks/
    │   ├── useProducts.ts        → CRUD produits + toggle visibilité
    │   ├── useOrders.ts          → Commandes + changement statut
    │   ├── useSettings.ts        → Chargement/sauvegarde paramètres boutique
    │   └── useAppTheme.ts        → Thème clair/sombre via Zustand
    ├── lib/
    │   ├── products.ts           → Fonctions Supabase produits
    │   ├── orders.ts             → Fonctions Supabase commandes
    │   ├── settings.ts           → Fonctions Supabase settings
    │   ├── storage.ts            → Upload images Supabase Storage
    │   └── utils.ts              → formatPrice, formatDate
    ├── store/
    │   ├── supabaseStore.ts      → Client Supabase dynamique (Zustand + AsyncStorage)
    │   ├── authStore.ts          → État d'authentification
    │   └── themeStore.ts         → Préférence thème persistée
    └── types/
        └── index.ts              → Types partagés (Product, Order, StoreSettings, etc.)
```

### Stack Technique
- **Framework** : Expo SDK 52 / React Native 0.76.7
- **Router** : Expo Router v4 (file-based, groupes de routes)
- **État** : Zustand v5 + AsyncStorage (persistance)
- **Backend** : Supabase JS v2 (PostgreSQL + RLS + Storage + Realtime)
- **Bytecode** : Hermes (100% compatible, regex safe — query-string@7.1.3)
- **Icons** : Lucide React Native
- **Build** : EAS Build (APK Android direct)
- **OTA** : Expo Updates (mises à jour sans recompiler)

---

## 3. ✅ Fonctionnalités Existantes (VALIDÉES)

### 3.1 Onboarding & Connexion
- [x] Écran `config.tsx` : saisie URL Supabase + Anon Key avec test de connexion temps réel
- [x] Écran `login.tsx` : authentification email/mot de passe Supabase Auth
- [x] Routage intelligent : config → login → admin (via `isReady` flag anti-race-condition)

### 3.2 Dashboard
- [x] StatCard "Articles au catalogue" (produits actifs)
- [x] StatCard "Commandes enregistrées" (total)
- [x] StatCard "Chiffre d'affaires estimé" (somme montants)
- [x] Pull-to-refresh

### 3.3 Gestion Produits
- [x] Liste produits avec toggle visibilité et suppression (confirmation Alert)
- [x] Formulaire création (`nouveau.tsx`) : nom, prix, stock, description
- [x] Formulaire édition (`[id].tsx`) : même champs + images existantes
- [x] Upload image native (`expo-image-picker` → Supabase Storage)
- [x] `BlockEditor.tsx` : ajout/suppression/réordre de blocs rich-content

### 3.4 Gestion Commandes
- [x] Liste commandes avec `StatusBadge` coloré
- [x] Tap sur commande → `Alert` pour changer le statut
- [x] Affichage détails client (champs dynamiques `fields_data`)
- [x] Statuts actuels : `nouveau | confirmé | livré | annulé`

### 3.5 Paramètres Boutique
- [x] Thème clair/sombre (toggle persisté)
- [x] Nom boutique, WhatsApp, téléphone, titres bannière
- [x] Bouton "Modifier les Clés Supabase" (retour config)
- [x] Déconnexion sécurisée (Supabase Auth signOut)

---

## 4. 🚧 Fonctionnalités à Implémenter (ROADMAP)

### Sprint 1 — Features Africaines Critiques

#### 4.1 Notifications Push — Nouvelles Commandes
> **Inspiré de** : Shopify App  
> **Priorité** : 🔴 Critique  

- Utiliser `expo-notifications` pour les notifications locales
- Supabase Realtime sur la table `orders` : écoute les `INSERT`
- Quand une nouvelle commande arrive : notif push "🛒 Nouvelle commande ! {product_nom}"
- Hook `useOrderNotifications` branché dans `(admin)/_layout.tsx`
- Demande de permission au premier lancement admin

**Fichiers à créer :**
- `src/lib/notifications.ts` — setup permissions + notif locale
- `src/hooks/useOrderNotifications.ts` — Realtime listener

#### 4.2 Profit Tracker — Coût d'Achat & Marge
> **Inspiré de** : Tassyir  
> **Priorité** : 🔴 Critique  

- Ajout champ `cout_achat?: number` dans le type `Product`
- FormField "Coût d'achat" dans `nouveau.tsx` et `[id].tsx`
- Dashboard : nouvelle StatCard "Marge Brute Estimée"
- DB : migration `ALTER TABLE products ADD COLUMN cout_achat BIGINT DEFAULT 0`

#### 4.3 Statuts Commandes Enrichis
> **Inspiré de** : Tassyir, Shafrik  
> **Priorité** : 🟡 Haute  

Statuts enrichis : `nouveau | confirmé | en_livraison | livré | retourné | annulé`

- Mise à jour `StatusBadge` : couleurs pour `en_livraison` (bleu) et `retourné` (orange)
- Alert de changement de statut avec tous les nouveaux statuts
- Dashboard : StatCard "Taux de Retour" (vert < 15%, orange < 30%, rouge sinon)

#### 4.4 Partage Produit 1-tap
> **Inspiré de** : YouCan  
> **Priorité** : 🟡 Haute  

- Dans la liste produits : bouton partage avec `Share` API React Native
- Génère le lien `https://[storefront-url]/produit/[slug]`
- Message pré-formaté : "Découvrez {nom} - {prix} GNF — {url}"

### Sprint 2 — Polish & Performance

#### 4.5 Rebranding Easyphy
- [ ] Remplacer toutes les occurrences "Zistore", "Easy Store", "Menma Store" par **Easyphy**
- [ ] Mettre à jour `app.json` : `name`, `slug`, `package` → `com.easyphy.admin`
- [ ] Icône app Easyphy (à créer)

#### 4.6 Statistiques Avancées Dashboard
- [ ] Graphique de commandes par jour (7 derniers jours)
- [ ] Top 3 produits les plus commandés
- [ ] Revenu net estimé (CA - coûts d'achat)

#### 4.7 Recherche & Filtres
- [ ] Barre de recherche dans la liste produits
- [ ] Filtre commandes par statut (tabs ou dropdown)
- [ ] Tri commandes par date / montant

---

## 5. 🎨 Design System — Tokens Thème

Fichier de référence : `src/constants/theme.ts`

### Bi-Thème : Clair First (défaut) + Sombre Luxury

**Thème Clair (Light Mode — Priorité 1)** :
- Fond : `#f8fafc` (Slate-50)
- Cartes : `#ffffff`
- Accent : `#d97706` (Ambre doré)
- Texte : `#0f172a`

**Thème Sombre (Dark — "Warm Luxury Noir")** :
- Fond : `#060501` (Noir encre)
- Cartes : `#100e04`
- Accent : `#facc15` (Or éclatant)
- Texte : `#fef9e7` (Ivoire)

### Tab Bar Flottante — 4 Onglets
- Position : floating pill, bottom 14–24px selon plateforme
- Bordure radius : 28px
- Ombres adaptées au thème

---

## 6. 🗄️ Schéma DB Partagé avec le Storefront

> Le schéma complet est dans `../supabase/schema.sql`  
> L'app mobile et l'admin web lisent/écrivent dans la **même** base Supabase.

### Migrations à Appliquer (Sprint 1)
```sql
-- Ajouter coût d'achat aux produits
ALTER TABLE products ADD COLUMN IF NOT EXISTS cout_achat BIGINT DEFAULT 0;

-- Statuts enrichis (si contrainte CHECK existante, la supprimer d'abord)
-- Le champ statut est TEXT — pas de migration nécessaire, juste les nouvelles valeurs
```

---

## 7. ⚙️ Configuration Build EAS

```json
// eas.json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "apk" }
    }
  }
}
```

### Variables d'Environnement EAS
Aucune variable fixe requise — les clés Supabase sont saisies par l'utilisateur dans l'app (`config.tsx`).

---

## 8. 🔗 Lien avec le Storefront/Admin Web

> **Dépôt lié** : `menma-store/` — Storefront Next.js + Admin Web  
> **PRD Web** : voir `menma-store/PRD.md`

### Points de Synchronisation Critiques
1. **Types partagés** : `Product`, `Order`, `StoreSettings` doivent rester synchronisés entre `menma-store/src/lib/types.ts` et `menma-store-app/src/types/index.ts`
2. **Statuts commandes** : toute nouvelle valeur de `statut` doit être mise à jour dans les deux apps
3. **Schema SQL** : `../supabase/schema.sql` est la source de vérité unique

---

## 9. 📋 Checklist Déploiement

### Pré-requis Utilisateur
- [ ] Créer un compte Supabase gratuit sur supabase.com
- [ ] Exécuter `../supabase/schema.sql` dans le SQL Editor Supabase
- [ ] Créer l'utilisateur admin dans Supabase > Authentication > Users
- [ ] Configurer les buckets Storage : `products` et `assets` (accès public)

### Build APK
```bash
cd menma-store-app
npx expo install          # Vérifier dépendances
eas build --platform android --profile preview
```

### OTA Update (sans recompiler)
```bash
eas update --channel preview --message "Description de la mise à jour"
```
