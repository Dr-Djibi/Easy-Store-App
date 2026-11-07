# 🎨 Directives Impeccable UI/UX — Menma Shop (Easy-Store)

Ce document rassemble les principes fondamentaux issus des bonnes pratiques **Impeccable** et design system appliqués à la boutique web (Next.js) et à l'application mobile (Expo).

---

## 1. Principes de Design & Ergonomie (Mobile-First)

### A. Hiérarchie Visuelle & Clarté
- **Contraste maximal** : Utilisation d'un fond d'encre sombre profond (`#060501`) avec surfaces étagées (`#100e04`, `#18160a`, `#221f0f`) pour guider l'œil sans fatigue visuelle.
- **Accents Dorés & Sémantiques** :
  - **Accentuation principale** : Jaune or (`#facc15`) pour les CTA de conversion (Acheter, Confirmer, Actions clés).
  - **Statuts** : Vert émeraude (`#4ade80`) pour le succès/livré, bleu (`#38bdf8`) pour les confirmations, rouge brique (`#ef4444`) pour les alertes/annulations.
- **Micro-surfaces en Glassmorphism** : Cartes floutées (`backdrop-blur-md` ou `backdrop-blur-xl`) avec bordures délicates (`rgba(255, 255, 255, 0.12)`).

### B. Cible Tactile & Confort d'Utilisation (Mobile UX)
- **Taille minimale des cibles de clic/tap** : `48px x 48px` pour tous les boutons d'action et champs de saisie.
- **Tunnel d'achat fluide** :
  - Minimum d'étapes : choix de la quantité avec boutons larges `+` / `-`, champs essentiels du formulaire.
  - Redirection WhatsApp automatisée avec message pré-formaté lisible.
- **Anti-patterns évités** :
  - Pas de popups bloquants intempestifs.
  - Pas de textes tronqués illisibles sur petits écrans.
  - Pas de contrastes insuffisants gris-sur-gris.

### C. Fiches Produits & Storytelling de Vente (Copywriting Modulaire)
- **Structure séquentielle dynamique** :
  1. *Galerie / Visuel principal* : Image nette, format carré `aspect-square`.
  2. *Accroche & Titre* : Taille `2xl` à `4xl`, gras affirmé.
  3. *Tunnel d'action immédiat* : Prix, quantité, bouton de commande WhatsApp.
  4. *Blocs de persuasion (Rich-Content)* :
     - Grand titre d'accroche (bénéfice client).
     - Image descriptive ou preuve sociale.
     - Paragraphe d'explication aéré avec saut de ligne respecté (`whitespace-pre-line`).

---

## 2. Checklist d'Audit Impeccable par Composant

| Composant | Critères Impeccable | Statut |
|---|---|---|
| **HeroBanner** | Titre percutant, contraste lisible, bouton CTA contrasté avec scroll fluide vers `#produits` | ✅ Conforme |
| **ProductCard** | Image optimisée, badge rupture de stock clair, prix mis en avant, tap cible large | ✅ Conforme |
| **OrderTunnel** | Sélecteur de quantité réactif, formulaire concis, indicateur de chargement, feedback de succès | ✅ Conforme |
| **ContentBlockRenderer** | Rendu progressif, gestion propre des images, polices aérées | ✅ Conforme |
| **App Mobile BlockEditor** | Boutons de réordonnancement (Monter / Descendre), suppression sécurisée, champs prévisualisés | ✅ Conforme |
