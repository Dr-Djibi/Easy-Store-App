# 🎨 Directives Impeccable UI/UX & Design System Pro Max — Easy Store

Ce document rassemble les principes fondamentaux issus des bonnes pratiques **Impeccable** et du **Design System UI/UX Pro Max** appliqués à la boutique web (Next.js) et à l'application mobile admin (React Native Expo).

---

## 1. Principes de Design & Ergonomie (Mobile-First & Touch-First)

### A. Philosophie "Warm Luxury Noir" & Couleurs Sémantiques
L'identité visuelle repose sur un thème sombre profond ("Warm Noir") aux reflets dorés chauds, évitant la fatigue oculaire et maximisant le taux de conversion e-commerce :

| Rôle Visuel | Token / Valeur | Signification & Règle d'usage |
|---|---|---|
| **Fond Primaire (Canvas)** | `#060501` | Noir chaud d'encre profond. Utilisé pour le background de l'app et du web. |
| **Surfaces & Cartes** | `#100e04` | Surface niveau 1 surélevée. Bordures fines `rgba(255, 255, 255, 0.12)`. |
| **Inputs & Sous-surfaces** | `#18160a` | Surface interactive en retrait (champs formulaires, détails badges). |
| **Surface Élevée (Modales)** | `#221f0f` | Élévation z-index haute, popovers et menus d'actions contextuels. |
| **Accent Principal (CTA)** | `#facc15` (Gold Amber) | Réservé **exclusivement** aux actions d'achat, de sauvegarde et de mise en avant active. |
| **Accent Confirmation / Info** | `#38bdf8` (Sky) | État "Commande confirmée", notifications de routage et boutons d'édition. |
| **Accent Succès / Réassort** | `#4ade80` (Emerald) | Statut "Livré", stock disponible, validation réussie. |
| **Accent Danger / Alerte** | `#ef4444` (Coral Red) | Suppression, rupture critique, commande annulée, déconnexion. |
| **Typographie Principale** | `#fef9e7` | Blanc ivoire chaud (95% opacité) pour un confort de lecture optimal. |
| **Typographie Atténuée** | `rgba(254, 249, 231, 0.65)` | Labels secondaires, timestamps, explications de champs. |
| **Typographie Discrète** | `rgba(254, 249, 231, 0.40)` | Placeholders, dates d'historique, mentions légales. |

---

## 2. Règles Ergonomiques "Impeccable UI/UX"

### A. Confort Tactile & Hit-Areas (WCAG & Apple/Android HIG)
1. **Cibles tactiles minimales** : `48px x 48px` minimum pour tous les boutons d'action (`addBtn`, `saveBtn`, sélecteurs de quantité).
2. **Espacements normalisés** :
   - `xs: 4px`, `sm: 8px`, `md: 12px`, `lg: 16px`, `xl: 20px`, `xxl: 24px`, `xxxl: 30px`.
3. **Rayons de courbure (Border Radius)** :
   - Badges et pastilles : `6px` à `8px` (`RADII.sm` / `RADII.md`).
   - Inputs et boutons : `12px` (`RADII.xl`).
   - Cartes et conteneurs : `16px` à `18px` (`RADII.xxl` / `RADII.xxxl`).

### B. Storytelling de Vente Modulaire (Copywriting Maestro)
Sur la fiche produit (`/produit/[slug]` et aperçu app) :
1. **Header immédiat** : Image principale plein format + Titre produit percutant + Prix en relief doré + Stock.
2. **Tunnel d'achat compact** : Choix de quantité tactile + Bouton CTA WhatsApp pré-rempli au-dessus de la ligne de flottaison.
3. **Blocs de persuasion (Rich-Content Blocks)** :
   - *Titre d'accroche* : Avantage immédiat pour le client (ex: « Pourquoi vous ne pourrez plus vous en passer »).
   - *Paragraphe persuasif* : Texte aéré avec sauts de lignes conservés (`whitespace-pre-line`).
   - *Image de démonstration* : Preuve sociale ou mise en situation du produit.

---

## 3. Checklist d'Audit Impeccable par Composant

| Composant | Critères Impeccable & Pro Max | Statut Mobile App | Statut Storefront Web |
|---|---|---|---|
| **LoadingScreen** | Spinner centré couleur `#facc15` sur fond `#060501` sans saut d'écran | ✅ Conforme | ✅ Conforme |
| **EmptyState** | Icône expressive, message clair incitant à l'action sans écran vide | ✅ Conforme | ✅ Conforme |
| **StatusBadge** | Double contraste (fond semi-transparent `0.15` + bordure fine `0.3` + texte plein) | ✅ Conforme | ✅ Conforme |
| **FormField** | Label audacieux, placeholder haute lisibilité, focus border accentué | ✅ Conforme | ✅ Conforme |
| **StatCard** | Carte métrique avec icône sémantique, valeur grand format et libellé clair | ✅ Conforme | ✅ Conforme |
| **BlockEditor** | Boutons réordonnancement (Monter/Descendre), suppression protégée, upload d'image natif | ✅ Conforme | N/A (Admin) |
| **OrderTunnel** | Sélecteur de quantité tactile réactif, redirection WhatsApp automatique avec message formaté | N/A | ✅ Conforme |
