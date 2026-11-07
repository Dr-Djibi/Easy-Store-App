# 🌍 Zistore — Architecture UI/UX, Design System & Spécifications Techniques (context.md)

> **Projet** : Zistore (Alternative e-commerce moderne taillée pour le marché africain)  
> **Version** : 3.0.0 — Refonte UI/UX Majeure : Thème Clair First, Navigation Pill 4 Onglets & Éditeur Description WYSIWYG  
> **Date de révision** : 7 Novembre 2026  
> **Standards appliqués** : **ECC (Everything Cloud Code)**, **Impeccable UI/UX Pro Max**, **Touch-First Accessibility**, **Hermes Bytecode Safe**

---

## 1. 🎯 Vision Produit : L'E-Commerce Taillé pour l'Afrique

**Zistore** réinvente le commerce en ligne pour les entrepreneurs, commerçants indépendants et marques émergentes en Afrique et sur les marchés à forte croissance :

1. **Légèreté & Performance Maximale** : Fonctionnement réactif sur les smartphones Android d'entrée et de milieu de gamme, temps de chargement quasi-instantané et faible consommation de données mobiles.
2. **Tunnel Conversationnel WhatsApp First** : Pas de barrière de paiement par carte bancaire obligatoire ; la commande s'effectue directement par message WhatsApp pré-formaté et synchronisation directe avec le stock.
3. **Indépendance Totale ("Bring-Your-Own-Supabase")** : Le commerçant ne paie aucun abonnement mensuel type Shopify, il possède ses données, ses commandes et ses images sur son propre backend Supabase.
4. **Priorité 1 — Lisibilité en Plein Soleil (Light Mode First)** : Un thème clair éclatant, contrasté et reposant (norme WCAG AAA), optimisé pour une utilisation en extérieur et en mobilité commerciale sous forte luminosité.
5. **Fiabilité Tactile & Zéro Débordement Visuel** : Finitions soignées (Impeccable UI/UX), élimination des bugs de superposition d'images et confort de saisie optimal.

---

## 2. 🎨 Système de Design Bi-Thème (Impeccable UI/UX Pro Max)

L'application s'articule autour de deux palettes strictes gérées via Zustand et mémorisées dans `AsyncStorage` :

### A. Thème Clair (Light Mode — Priorité Absolue & Actif par Défaut)
Inspiré des interfaces minimalistes et épurées internationales (Shopify, Linear, Apple) avec une touche chaleureuse ambrée :
- **Arrière-plan Principal (`BG_PRIMARY`)** : `#f8fafc` (Slate-50 doux et moderne, lisible en extérieur).
- **Cartes & Surfaces (`BG_CARD`)** : `#ffffff` (Blanc pur immaculé avec ombre portée très subtile).
- **Surfaces d'Inputs & Badges (`BG_INPUT`)** : `#f1f5f9` (Gris slate très clair, contrastant nettement avec les cartes).
- **Surfaces Alternatives (`BG_SURFACE_ALT`)** : `#e2e8f0` (Délimitations de sections secondaires).
- **Typographie Principale (`TEXT_PRIMARY`)** : `#0f172a` (Noir ardoise profond, contraste maximal).
- **Typographie Atténuée (`TEXT_MUTED`)** : `#64748b` (Gris ardoise pour les labels, compteurs et aides).
- **Typographie Placeholder (`TEXT_FAINT`)** : `#94a3b8` (Gris clair pour les textes d'invitation).
- **Bordures (`BORDER`)** : `#e2e8f0` (Contours nets, fins et précis).
- **Bordures Subtiles (`BORDER_FAINT`)** : `#f1f5f9`.
- **Accentuation Action (`ACCENT`)** : `#d97706` / `#b45309` (Ambre doré chaleureux, contraste élevé sur blanc).
- **Surfaces d'Accentuation (`ACCENT_BG`)** : `rgba(217, 119, 6, 0.12)` (Badges et états actifs).
- **Couleurs d'État** :
  - Succès : `#16a34a` / fond `rgba(22, 163, 74, 0.12)`
  - Info : `#0284c7` / fond `rgba(2, 132, 199, 0.12)`
  - Alerte / Danger : `#dc2626` / fond `rgba(220, 38, 38, 0.12)`
- **Barre Inférieure Flottante (`NAV_BG`)** : `#ffffff` avec contour `#e2e8f0` et ombre douce `rgba(15, 23, 42, 0.08)`.

### B. Thème Sombre (Dark Mode — "Warm Luxury Noir")
Pour le confort visuel en environnement nocturne ou faible luminosité :
- **Arrière-plan Principal (`BG_PRIMARY`)** : `#060501` (Noir encre profond).
- **Cartes & Surfaces (`BG_CARD`)** : `#100e04` (Noir chaud avec légère surélévation).
- **Surfaces d'Inputs (`BG_INPUT`)** : `#18160a` (Surface creusée pour la saisie).
- **Typographie Principale (`TEXT_PRIMARY`)** : `#fef9e7` (Blanc ivoire chaud anti-éblouissement).
- **Typographie Atténuée (`TEXT_MUTED`)** : `rgba(254, 249, 231, 0.65)`.
- **Bordures (`BORDER`)** : `rgba(255, 255, 255, 0.12)`.
- **Accentuation Action (`ACCENT`)** : `#facc15` (Jaune doré éclatant).
- **Barre Inférieure Flottante (`NAV_BG`)** : `#100e04` avec bordure `rgba(255, 255, 255, 0.12)`.

---

## 3. 📱 Architecture de la Navigation Basse (Floating Pill — 4 Onglets)

La barre de navigation inférieure est rationalisée sous la forme d'une **pilule flottante à forte courbure (`borderRadius: 28`)** surélevée au-dessus du bord inférieur de l'écran :

```
┌─────────────────────────────────────────────────────────────┐
│  [Accueil]       [Commandes]       [Produits]   [Paramètres] │
│   (KPIs)          (Ventes)         (Articles)      (Hub)    │
└─────────────────────────────────────────────────────────────┘
```

1. **Accueil (`src/app/(admin)/index.tsx`)** : Tableau de bord des performances (chiffre d'affaires estimé, total des commandes enregistrées, volume de stock en rayon).
2. **Commandes (`src/app/(admin)/commandes/index.tsx`)** : Gestion du cycle de vente avec mise à jour rapide des statuts (`nouveau`, `confirmé`, `livré`, `annulé`) et formatage soigné des montants.
3. **Produits (`src/app/(admin)/produits/index.tsx`)** : Gestion du catalogue complet, recherche rapide, bascule de visibilité actif/inactif en un tap et accès immédiat à la création/édition d'articles.
4. **Paramètres (`src/app/(admin)/reglages/index.tsx`)** : Hub de configuration commerciale :
   - **Sélecteur de Thème Interactif (Clair ☀️ / Sombre 🌙)** persistant dans `AsyncStorage`.
   - Identité du magasin, contact officiel WhatsApp et téléphone d'appel direct.
   - Textes de bannières d'accueil et gestion de la session Supabase.

---

## 4. 📝 Spécifications de la Fiche Produit & Éditeur WYSIWYG

### A. Présentation de la Fiche Produit
La vue de création (`nouveau.tsx`) et de modification (`[id].tsx`) intègre :
- **Statut de l'article** : Sélecteur Actif (publié en boutique) / Brouillon (en cours de rédaction).
- **Canaux de publication** : Badges d'activation (Boutique Web, WhatsApp Direct, Réseaux Sociaux).
- **Carrousel Multimédia Multi-supports** :
  - Support de plusieurs photos et liens vidéo de présentation.
  - Carrousel horizontal ergonomique avec bouton d'ajout (Galerie / Caméra / URL directe).
  - Badge visuel distinctif "Image Principale".
  - Retrait d'image en un tap sans rechargement.
- **Gestion des Slugs Produits** :
  - Champ interactif avec normalisation automatique anti-accents (`generateSlug`) synchronisé en temps réel sur la saisie du titre.
  - Possibilité de déverrouiller la personnalisation manuelle ou de rétablir la synchronisation automatique en un clic.
  - Prévisualisation permanente de l'URL finale (`/produit/nom-du-produit`).

### B. Barre d'Outils Complète WYSIWYG
Un composant dédié `RichTextEditor.tsx` propose une barre d'outils exhaustive et accessible :
1. **Typographie & Titres** : Bascule Normal, Titre 1 (`H1`), Titre 2 (`H2`).
2. **Mise en forme du texte** : Gras (**B**), Italique (*I*), Souligné (<u>U</u>).
3. **Personnalisation visuelle** :
   - Sélecteur de couleurs de texte via palette dédiée (Noir/Texte, Ambre doré, Vert émeraude, Bleu ciel, Rouge rubis, Violet royal).
   - Alignements typographiques : Gauche, Centré, Droite, Justifié.
4. **Structure & Listes** : Listes à puces (`•`), listes numérotées (`1.`), indentations et citations.
5. **Médias & Intégrations** :
   - Insertion de liens hypertextes cliquables.
   - Insertion d'images inline avec texte alternatif.
   - Insertion de vidéos d'illustration.
   - Insertion de tableaux structurés (colonnes et lignes).
   - Mode Code Source (`</>`) permettant de basculer instantanément entre l'aperçu formaté et le balisage brut.

### C. Éradication des Bugs Critiques de Scroll et de Superposition d'Image
- **Cause racine historique** : Débordement d'éléments multimédias hors de leur boîte flex avec positionnement ambigu, provoquant un passage en avant-plan (`z-index`) au-dessus des inputs et bloquant le défilement vertical du formulaire lorsque le clavier virtuel est ouvert.
- **Correctifs d'ingénierie appliqués** :
  1. **Confinement strict des conteneurs de média** : Définition d'un ratio ou d'une hauteur calibrée (`aspectRatio: 16/9` ou hauteur fixe), avec `overflow: 'hidden'`, `borderRadius` contrôlé et `position: 'relative'`.
  2. **Hiérarchie de scroll hermétique** :
     - Encapsulation dans `KeyboardAvoidingView` avec décalage adaptatif selon la plateforme (`Platform.OS === 'ios' ? 'padding' : undefined`).
     - `ScrollView` paramétré avec `keyboardShouldPersistTaps="handled"`, `nestedScrollEnabled={true}` et un `contentContainerStyle` disposant d'un padding inférieur généreux (160px) pour que tous les champs restent accessibles au-dessus du clavier et de la barre flottante.
  3. **Barre d'outils WYSIWYG intégrée au flux** : La barre d'outils dispose de son propre conteneur scrollable horizontalement, confiné dans la carte d'édition sans interférer avec les éléments parents.

---

## 5. 🛠️ Stack Technique & Bibliothèques Clés

- **Framework Mobile** : React Native (0.76.7) / Expo SDK 52 / Expo Router v4.
- **Gestion d'État & Thème** : Zustand (v5) avec persistance `AsyncStorage`.
- **Backend & Base de données** : Supabase JS v2 (PostgreSQL + RLS + Storage Buckets).
- **Icônes & Visuels** : Lucide React Native (`lucide-react-native`).
- **Storefront Web** : Next.js 15 (App Router), Tailwind CSS v4, TypeScript.
- **Compilateur & Bytecode** : Moteur Hermes (100% compatible regex / no-eval).
