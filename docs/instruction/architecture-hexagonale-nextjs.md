---
description: Architecture Next.js (App Router) — couches, dépendances, checklist nouvelle page
alwaysApply: true
---

# Architecture Next.js (App Router)

Adaptation de l'architecture hexagonale des services NestJS au frontend `admin-frontend` (Next.js 15, React 19).
Le frontend est un **client** des services backend : il ne contient pas de règle métier propre, il **consomme**
des contrats HTTP (ports sortants) et les **affiche**.

## Règle d'or

Les dépendances pointent **vers l'intérieur** :

- `types/` ne connaît personne (pas React, pas Next, pas `fetch`)
- `lib/` ne connaît que `types/` et `config/` (pas de React, pas de JSX)
- `components/ui/` ne connaît que `types/` : composant générique, **aucun** appel API, **aucun** import de `sections/`
- `components/sections/` connaît `ui/`, `types/` et `lib/` (via hooks / props)
- `app/` connaît tout : c'est le point d'entrée (routage, assemblage, données serveur)

```
app → components/sections → components/ui → types
 └──────────→ lib (api, mappers, schémas) → config, types
```

Correspondance avec l'hexagonale backend :

| Backend NestJS | Frontend Next.js |
|----------------|------------------|
| `domain/entities`, `enums` | `types/` |
| `port/out` (repository) | signatures de `lib/api/endpoints.ts` |
| `adapter/out` (Prisma) | `lib/api/client.ts` (fetch + normalisation d'erreur) |
| `adapter/in` (controller) | `app/**/page.tsx`, Route Handlers, Server Actions |
| `application/dto`, `mapper` | `lib/mappers/`, `lib/schemas/` |
| `infrastructure/config` | `config/env.ts`, `next.config.ts` |

## Couches sous `src/`

| Couche | Rôle | Contient |
|--------|------|----------|
| `app/` | Routage & assemblage | `(auth)/`, `(admin)/` (route groups), `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` |
| `components/sections/` | Blocs fonctionnels | `auth/`, `admin/<feature>/` : composants métier, `index.ts`, `mockData.ts` (transitoire) |
| `components/ui/` | Design system léger | un dossier par composant générique (`button/`, `card/`, `form/input/`…) |
| `hooks/` | Logique client réutilisable | `use<Nom>.ts` (à créer au besoin) |
| `lib/` | Logique sans UI | `api/` (client, endpoints), `mappers/`, `schemas/`, `utils/` |
| `types/` | Contrats de données | un fichier par entité (`member.ts`, `treasury.ts`), `api.ts` (erreurs, requêtes) |
| `config/` | Configuration | `env.ts` (variables d'environnement validées) |

Hors `src/` : `public/assets/` (CSS + JS vendor du thème), `__tests__/` (tests), `docs/`.

## Règles par emplacement

- **types/** : types/interfaces purs, aucun import de React ; DTO API nommés `XxxDto`, entités d'affichage sans suffixe
- **config/env.ts** : seul endroit qui lit `process.env` ; échoue vite si une variable manque ; secrets **jamais** en `NEXT_PUBLIC_`
- **lib/api/client.ts** : unique appelant de `fetch` ; normalise **toute** erreur en `ApiError` (`code` + `status` + `message`), le reste de l'app parle en **codes**, jamais en statuts HTTP bruts
- **lib/api/endpoints.ts** : une fonction typée par appel (`getMembers`, `createMember`…) ; ne renvoie jamais `unknown`/`any`
- **lib/mappers/** : DTO API ↔ type d'affichage ; le DTO **ne fuit jamais** tel quel dans un composant
- **lib/schemas/** : validation d'exécution (Zod ou équivalent, à installer) des réponses API et des formulaires ; distincte des types TS
- **components/ui/** : pas d'état métier, pas de fetch ; reçoit tout par props ; props ≤ 7 ; `className` extensible
- **components/sections/** : compose des `ui/` ; reçoit ses données par props depuis la page (pas de fetch dans le composant si un Server Component parent peut le faire)
- **hooks/** : une seule préoccupation par hook ; `useEffect` en dernier recours
- **app/**`page.tsx` : mince — récupérer (serveur) → passer en props → assembler ; zéro logique métier, `metadata` exporté
- **Server Actions / Route Handlers** : points d'entrée publics → valider (schéma) + autoriser **à chaque appel**
- **Navigation** : `components/sections/admin/navbar/menuItems.ts` est la **source unique** ; nouvelle page = une entrée ici
- **Server vs Client** : Server Component par défaut ; `"use client"` le plus bas possible dans l'arbre (état, effets, événements, API navigateur uniquement)

## Pont vers les scripts vanilla (thème Bootstrap)

Le thème `Admin-html/` est porté en React ; ses CSS/JS vendor (ApexCharts, GridJS, FullCalendar, Simplebar, Bootstrap) restent dans `public/assets/`.

- Seul `app/layout.tsx` possède `<html>/<body>` et charge les `<Script>` globaux ; `(admin)/layout.tsx` ne les redéclare **jamais** ; `{children}` rendu **une seule fois**
- Tout script vanilla à initialisation impérative est **encapsulé dans un composant client** (modèle : `AppCalendar.tsx`) : chargement unique (`loadScriptOnce`), `init`/`destroy` exposés sur `window` et appelés au montage/démontage, communication React ↔ vanilla par `CustomEvent`
- Le code de `public/assets/` est du **vendor** : on ne le modifie pas, on ne l'importe pas depuis `src/`, on ne le teste pas

## Interdits

- Pas de `fetch` direct dans un composant, un hook ou une page : tout passe par `lib/api`
- Pas d'import de `sections/` depuis `ui/`, ni de `components/` depuis `lib/` ou `types/`
- Pas de `any` : `unknown` puis affiner (ou schéma)
- Pas de secret dans une variable `NEXT_PUBLIC_*`, pas d'import de code serveur dans un composant client (`server-only`)
- Pas de `dangerouslySetInnerHTML` non assaini
- Pas de nouvelle `mockData.ts` une fois l'endpoint disponible : la donnée vient de `lib/api`
- Imports **toujours** via l'alias `@/…` (= `src/…`), jamais de chemins relatifs remontants `../../`

## Checklist nouvelle page / fonctionnalité

1. types (`types/<entite>.ts` + `XxxDto`) → 2. `lib/api/endpoints.ts` (fonction typée) → 3. schéma (`lib/schemas`) si donnée externe ou formulaire
4. mapper (`lib/mappers`) → 5. composants `ui/` manquants → 6. composants `sections/admin/<feature>/` (+ `index.ts`)
7. hook (`hooks/`) si logique client → 8. `app/(admin)/<route>/page.tsx` (+ `metadata`) → 9. `loading.tsx` / `error.tsx` / `not-found.tsx`
10. entrée dans `menuItems.ts` → 11. les 4 états d'UI (chargement, erreur, vide, succès) → 12. tests
