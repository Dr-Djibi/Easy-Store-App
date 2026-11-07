# 📋 Feuille de Route & Passations Techniques (passations.md)

> Mémoire persistante inter-sessions — Standards **ECC (Everything Cloud Code)**, **Impeccable UI/UX Pro Max** & **Hermes Bytecode Safe**  
> Date : 7 Novembre 2026  
> Auteur : Lead UI/UX Engineer & Full-Stack Developer  

---

## 🎯 Mission : Refonte UI/UX Zistore

Finaliser et sublimer l'application **Zistore** en éliminant tous les bugs visuels, de superposition d'images et de blocage de défilement, en introduisant en priorité absolue le **Thème Clair natif** avec sélecteur persistant, en modernisant la barre de navigation en **pilule flottante à 4 onglets**, et en dotant la fiche produit d'un **éditeur de description WYSIWYG complet** avec carrousel multimédia et gestion de slugs.

---

## 🗺️ Journal d'Exécution & État de Validation

### ✅ Phase 1 : Cadrage Architectural & Documentation (Terminé)
- [x] Rédaction et validation de [`context.md`](file:///home/menma/Shop%20Project/context.md) (spécifications détaillées, vision Afrique, tokens bi-thème, navigation pill, éditeur WYSIWYG, confinement scroll/médias).
- [x] Rédaction et validation de [`passations.md`](file:///home/menma/Shop%20Project/passations.md) (feuille de route structurée, étapes de développement et protocoles de validation).

---

### ✅ Phase 2 : Socle Bi-Thème (Thème Clair First) & Sélecteur Paramètres (Validé)
- [x] Tokens déclarés dans [`src/constants/theme.ts`](file:///home/menma/Shop%20Project/menma-store-app/src/constants/theme.ts) :
  - `THEME_LIGHT` (Slate-50, cartes blanches pures, typographie ardoise `#0f172a`, ambre doré `#d97706`, ombres douces).
  - `THEME_DARK` (Noir encre `#060501`, surfaces `#100e04`, texte ivoire `#fef9e7`, or `#facc15`).
  - `useAppTheme()` avec bascule réactive immédiate.
- [x] Sélecteur persistant dans [`src/app/(admin)/reglages/index.tsx`](file:///home/menma/Shop%20Project/menma-store-app/src/app/(admin)/reglages/index.tsx) :
  - Commutateur Clair ☀️ / Sombre 🌙 interactif, persistant dans `AsyncStorage` (`user_theme_preference`).

---

### ✅ Phase 3 : Refonte de la Navigation Basse (Barre Flottante "Pill" 4 Onglets) (Validé)
- [x] Barre flottante ergonomique dans [`src/app/(admin)/_layout.tsx`](file:///home/menma/Shop%20Project/menma-store-app/src/app/(admin)/_layout.tsx) :
  - Géométrie pill (`borderRadius: 28`, `position: 'absolute'`, `bottom: 14`, marges latérales 16, ombre portée).
  - 4 onglets fixes :
    1. **Accueil** (Dashboard & KPIs) — Icône `LayoutDashboard`
    2. **Commandes** (Suivis de ventes & statuts) — Icône `ShoppingBag`
    3. **Produits** (Catalogue & articles) — Icône `Package`
    4. **Paramètres** (Configurations, thème & boutique) — Icône `SlidersHorizontal`
  - États actifs/inactifs clairs avec pill background d'accentuation et micro-interactions tactiles.

---

### ✅ Phase 4 : Éditeur de Description WYSIWYG & Fiche Produit Zistore (Validé)
- [x] Création de [`src/components/product/RichTextEditor.tsx`](file:///home/menma/Shop%20Project/menma-store-app/src/components/product/RichTextEditor.tsx) :
  - **Typographie & Titres** : Titre 1 (`H1`), Titre 2 (`H2`), Paragraphe Normal (`Type`).
  - **Mise en forme du texte** : Gras (`Bold`), Italique (`Italic`), Souligné (`Underline`).
  - **Personnalisation visuelle** :
    - Palette de couleurs dédiée (Ardoise, Or ambré, Émeraude, Ciel, Rubis, Violet).
    - Alignements typographiques : Gauche, Centré, Droite, Justifié.
  - **Structure & Listes** : Listes à puces (`•`), listes numérotées (`1.`), indentations (`IndentIncrease`).
  - **Médias & Intégrations** : Modals d'insertion pour liens cliquables, images inline (galerie ou URL), vidéos et tableaux markdown.
  - **Bascule de Mode** : Mode Éditeur (code source / saisie fluide) et Mode Aperçu (rendu visuel direct).
- [x] Refactorisation de [`src/app/(admin)/produits/nouveau.tsx`](file:///home/menma/Shop%20Project/menma-store-app/src/app/(admin)/produits/nouveau.tsx) et [`src/app/(admin)/produits/[id].tsx`](file:///home/menma/Shop%20Project/menma-store-app/src/app/(admin)/produits/[id].tsx) :
  - Bouton retour supérieur explicite (`ArrowLeft`).
  - **Statut de l'article** : Sélecteur Actif (En Vente) / Brouillon.
  - **Canaux de publication** : Badges interactifs (Boutique Web, WhatsApp Direct, Réseaux Sociaux).
  - **Carrousel Multimédia Multi-supports** : Miniatures scrollables, badge "⭐ Principale", upload depuis galerie ou URL, réorganisation et suppression rapide.
  - **Gestion des Slugs Produits** : Synchronisation automatique en temps réel à la frappe du titre avec bouton "Rétablir Auto", aperçu de l'URL finale.
  - **Intégration de l'éditeur WYSIWYG**.
- [x] **Éradication des Bugs Critiques de Scroll et de Superposition** :
  - Confinement strict des miniatures et images (`aspectRatio`, `overflow: 'hidden'`, dimensions bornées, `position: 'relative'`).
  - Conteneur `KeyboardAvoidingView` + `ScrollView` avec `keyboardShouldPersistTaps="handled"`, `nestedScrollEnabled={true}` et `contentContainerStyle` avec padding inférieur de 160px pour garantir l'accessibilité permanente des boutons d'action.

---

### ✅ Phase 5 : Validation & Tests Systématiques (Preuves d'Exécution)
- [x] `npx tsc --noEmit` : **0 erreur** de typage TypeScript.
- [x] `npx expo export --platform web` : **Succès** (Bundle de 3.05 MB généré dans `dist`).
- [x] `npx expo export --platform android` : **Succès** (Bytecode Hermes de 5.31 MB généré dans `dist` avec 2662 modules compilés).
