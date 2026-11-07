# Easy Store Admin — CLAUDE.md

## Vue d'ensemble
Application mobile d'administration pour boutique e-commerce (Expo Router + Supabase).
Permet de gérer les produits, commandes et paramètres boutique.

## Stack
| Couche | Tech | Version |
|--------|------|---------|
| Framework | Expo / React Native | ~52 |
| Navigation | expo-router (file-based) | ~4 |
| Backend | Supabase (BaaS) | ^2.49 |
| State global | Zustand | ^5 |
| Icônes | lucide-react-native | ^0.475 |
| Language | TypeScript strict | ^5.3 |

## Structure clé
```
src/
  app/           → Routes expo-router (file-based)
    (admin)/     → Groupe de routes protégées (tabs)
  components/
    ui/          → Composants génériques réutilisables
    product/     → BlockEditor (rich content)
  constants/
    theme.ts     → SOURCE UNIQUE des couleurs, espacements, border-radius
  hooks/         → Hooks custom par domaine métier
    useProducts.ts
    useOrders.ts
    useSettings.ts
  lib/           → Fonctions Supabase pures (pas de hooks React)
  store/         → Stores Zustand (auth + supabase client)
  types/         → Types TypeScript partagés
```

## Conventions obligatoires
- **Couleurs** : toujours depuis `@/constants/theme` — jamais de valeur hex inline
- **Imports** : alias `@/` (ex: `import { COLORS } from '@/constants/theme'`)
- **Data fetching** : extraire dans un hook custom `src/hooks/use<Domaine>.ts`
- **Composants réutilisables** : `src/components/ui/` avec export depuis `index.ts`
- **Lib fonctions** : pures, sans hooks React, utilisent `useSupabaseStore.getState()`

## Commandes
```bash
# Développement
npx expo start

# Build EAS
eas build --platform android --profile preview

# TypeScript check
npx tsc --noEmit
```

## Palette (ne pas modifier)
```
BG_PRIMARY  #060501     ← fond principal (noir chaud)
BG_CARD     #100e04     ← cartes
BG_INPUT    #18160a     ← inputs
TEXT        #fef9e7     ← texte principal
ACCENT      #facc15     ← jaune (CTA, actif)
INFO        #38bdf8     ← bleu (confirmé)
SUCCESS     #4ade80     ← vert (livré)
DANGER      #ef4444     ← rouge (annulé, delete)
```

## Ajout d'un nouvel écran
1. Créer `src/app/(admin)/mon-ecran/index.tsx`
2. Ajouter un `<Tabs.Screen name="mon-ecran" ... />` dans `src/app/(admin)/_layout.tsx`
3. Si data fetching → créer `src/hooks/useMonEcran.ts`
