# État de admin-frontend

Dernière mise à jour : 2026-09-21

## Vérifications (toutes vertes)

- `npx tsc --noEmit` : OK
- `npm run lint` : 0 erreur, 0 warning (le vendor `public/**` est ignoré)
- `npm run test` : 6 suites / 23 tests (Jest + RTL) : OK
- `next build --turbopack` : OK (11 routes) — il échouait avant à cause de pages vides
- Smoke test `next start` : toutes les routes en 200, route inconnue en 404 (`not-found.tsx`), `/_next/image` sert les avatars

## Structure `src/`

- `app/` : `(admin)/` (dashboard, member, calendar, activity, treasury, archiver, about, project) + `(auth)/login`.
  Pages minces (assemblage), `loading.tsx` / `error.tsx` dans `(admin)/`, `not-found.tsx` à la racine.
- `components/sections/admin/<feature>/` : blocs métier, chacun < 150 lignes.
- `components/ui/` : design system léger. Nouveaux : `pagination` (contrôlé), `table/TableToolbar`, `table/TableFooter`,
  `dropdown/RowActions`, `badge/StatusBadge`, `empty-state/EmptyState`, `spinner/Spinner`.
- `hooks/` : `use-pagination`, `use-archive-filters`, `use-cie-calendar` (pont vers le script vanilla du calendrier).
- `lib/utils/` : `pagination`, `format-currency`, `calendar-events`, `archive-filters`, `vanilla-script` (fonctions pures, testées).
- `lib/api/` : `client.ts` (unique appelant de `fetch`) + `endpoints.ts` — pas encore branché aux pages.
- `types/` : `stat.ts` (StatItem unique), `calendar.ts`, `activity.ts`, etc.

## Garde-fous automatiques (`eslint.config.mjs`)

`no-restricted-imports` impose l'alias `@/…` (aucun `./` ni `../`) et les frontières de couches :
`types` ← rien ; `lib` ← types/config ; `hooks` ← lib/types ; `ui` ← types (+ autres `ui`) ; `sections` ← tout sauf `app`.

## Reste à faire

- Toutes les données viennent encore de `mockData.ts` : brancher `lib/api/endpoints.ts` + mappers + schémas Zod (à installer),
  puis supprimer les `mockData.ts`.
- Filtres / recherche des tableaux (membres, trésorerie, comptes) : l'UI est en place mais non fonctionnelle (menus sans action).
- Pas de MSW ni de test d'intégration / e2e Playwright pour l'instant (`__tests__/integrations`, `__tests__/e2e` à créer).
- Pas d'authentification : `(auth)/login` est un placeholder.
- `next/image` : quand les avatars viendront de l'API, déclarer `images.remotePatterns` dans `next.config.ts`.
- Textes hérités du thème en anglais (header : panier, notifications, menu profil ; `ActivityCard` « Buy Now »), liens
  `/pages/*`, `/auth/signout`, `/apps/ecommerce/*` qui pointent vers des routes inexistantes (404).
- `README.md` et `package.json` (`name: my_portfolio`) sont hérités d'un autre projet.
