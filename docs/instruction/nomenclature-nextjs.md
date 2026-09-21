---
description: Convention de nommage Next.js (dossiers, fichiers, composants, hooks, types, routes, env)
globs: "**/*.{ts,tsx,js}"
alwaysApply: true
---

# Nomenclature Next.js

Source : `convention-nomenclature-nestjs-nextjs.pdf` (partie Next.js) + conventions observées dans `src/`.

## Dossiers

Dossiers en **kebab-case**. Héritages **à conserver** (ne pas renommer) : dossiers `ui/` en snake_case
(`stat_card/`, `scroll_to_top/`, `list_group/`), `caroussel/`, `membres/`.
Les **nouveaux** dossiers suivent le kebab-case.

| Emplacement | Exemple |
|-------------|---------|
| Route (segment) | `app/(admin)/<route>/page.tsx` — kebab-case, minuscules |
| Route group | `(admin)`, `(auth)` |
| Section fonctionnelle | `components/sections/admin/<feature>/` |
| Composant générique | `components/ui/<composant>/` |
| Champs de formulaire | `components/ui/form/<champ>/` |
| Hooks | `hooks/use-<nom>.ts` |
| Client API / endpoints | `lib/api/` |
| Mappers / schémas | `lib/mappers/`, `lib/schemas/` |
| Types | `types/<entite>.ts` |
| Config | `config/env.ts` |
| Tests | `__tests__/{units,integrations,e2e}/` |

## Fichiers — suffixe par rôle

| Rôle | Fichier |
|------|---------|
| Composant React | `PascalCase.tsx` (`MemberTable.tsx`, `StatCard.tsx`) |
| Page / layout / états | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` (noms imposés par Next) |
| Barrel de section | `index.ts` (ré-exporte `default as Composant`, types, données) |
| Types d'une entité | `<entite>.ts` (`member.ts`) |
| Types locaux à une section | `types.ts` |
| Hook | `use-<nom>.ts` (`use-pagination.ts`) — export `useXxx` |
| Endpoints API | `endpoints.ts` (ou `<entite>.endpoints.ts` quand ils grossissent) |
| Client HTTP | `client.ts` |
| Mapper | `<entite>.mapper.ts` |
| Schéma de validation | `<entite>.schema.ts` |
| Server Actions | `<feature>.actions.ts` (`"use server"` en tête) |
| Route Handler | `app/api/<route>/route.ts` (nom imposé par Next) |
| Données factices | `mockData.ts` (transitoire, à côté du composant qui l'utilise) |
| Constantes / navigation | `menuItems.ts` (camelCase hérité) |
| Test unitaire / composant | `<fichier>.spec.ts` / `<Composant>.spec.tsx` |
| Test e2e | `<parcours>.spec.ts` (dossier `__tests__/e2e/`) |

Nouveaux fichiers non-composants : kebab-case. `mockData.ts` et `menuItems.ts` (camelCase) sont hérités, à conserver.

## Composants / types (PascalCase + suffixe)

| Rôle | Exemple |
|------|---------|
| Composant | `MemberTable` — un composant par fichier, `export default`, nom = nom du fichier |
| Sous-composant interne | `MemberStatusBadge` (même fichier, non exporté) |
| Variante | `StatCard` / `StatCard2`, `Alert` / `Alert2` (hérité ; préférer une prop `variant` à un suffixe numérique) |
| Props | `interface MemberTableProps` (ou `ButtonProps extends React.ButtonHTMLAttributes<…>`) |
| Entité d'affichage | `Member`, `Transaction` |
| DTO API | `MemberDto`, `HealthcheckDto` |
| Union de valeurs | `MemberStatus`, `MemberType`, `ApiErrorCode` |
| Erreur API | `ApiError` |
| Layout | `AdminLayout`, `RootLayout` |
| Page | `MembresPage`, `DashboardPage` (défaut exporté de `page.tsx`) |

## Variables, hooks, constantes

- locales / fonctions / params : `camelCase` (`apiClient`, `mapStatusToCode`)
- hooks : `useXxx` (préfixe `use` obligatoire)
- handlers : `handleXxx` (fonction locale) / `onXxx` (prop)
- booléens : `isXxx`, `hasXxx`, `canXxx`
- constantes de module : `UPPER_SNAKE_CASE` (`MEMBERS`, `MENU`, `PAGE_SIZE`, `TYPE_FILTER_OPTIONS`)
- codes d'erreur : `UPPER_SNAKE_CASE` (`NOT_FOUND`, `NETWORK_ERROR`)
- valeurs d'union métier : libellé métier lisible (`"Actif"`, `"Bureau"`) tant que l'UI est en français
- événements custom vanilla ↔ React : `cie<Nom>Changed` (`cieCalendarEventsChanged`) ; globals `window` : `cie<Nom>` (`initCieAppsCalendar`)

## Routes, alias, environnement

- routes : kebab-case, minuscules, sous les route groups ; noms alignés sur `menuItems.ts` (`/dashboard`, `/member`, `/calendar`…)
- paramètres dynamiques : `[publicId]` — on n'expose et n'utilise que le `publicId` côté URL, jamais l'`id` interne
- appels API : chemins absolus (`/members`) passés à `apiClient`, base URL dans `NEXT_PUBLIC_API_BASE_URL`
- alias d'import : `@/…` (= `src/…`), pas de `../../`
- env : `UPPER_SNAKE_CASE` ; `NEXT_PUBLIC_` **uniquement** pour ce qui peut aller au navigateur (`NEXT_PUBLIC_API_BASE_URL`)
- `metadata.title` : `"<Page> | CIE Admin"`
- classes CSS custom : kebab-case, BEM léger (`member-type-chip`, `member-type-chip--bureau`) ; classes du thème Bootstrap inchangées

## Tests

- `describe("NomExact")` : nom du composant, hook ou fonction testé
- `it` unitaire : verbe au présent (`"affiche"`, `"rejette"`, `"retourne"`) ; e2e : parcours utilisateur (`"un admin filtre les membres par type"`)
- requêtes RTL par rôle / texte (`getByRole`, `getByText`), pas par classe CSS
