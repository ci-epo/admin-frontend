# 2026-09-26 — Tableau de bord : statistiques branchées sur l'API réelle

## Fait
- `lib/api/dashboard.endpoints.ts` (nouveau) : `getMembersTotal`, `getProjectsTotals`, `getTreasuryBalance`.
- `lib/schemas/dashboard.schema.ts` (nouveau) : `readPaginatedTotal`, `parseAccountListPageDto`.
- `lib/api/dashboard.loader.ts` (nouveau) : `loadDashboardStats()` → `StatItem[]`, résilient (carte « Indisponible »
  par statistique en cas d'échec, ne bloque pas les 2 autres).
- `app/(admin)/dashboard/page.tsx` : Server Component async, `STATS` du mock remplacé par `loadDashboardStats()`.
- **Premier essai (annulé)** : `Account`/`AccountRow`/`GraphSuivi`/`Transaction.tsx` supprimés en pensant que « pas de
  données inventées » impliquait de retirer les sections qui ne pouvaient pas être branchées. Retour utilisateur :
  ce n'était pas la demande (« j'ai demandé d'effacer les données statiques, pas de tout supprimer »).
- **Correction appliquée** : les 4 fichiers restaurés à l'identique, `dashboard/page.tsx` re-rend `Account`/
  `GraphSuivi`/`Transaction` — mais avec les données vidées plutôt que remises :
  - `mockData.ts` : `ORDERS` redevient `[]` (au lieu des 5 lignes fictives) au lieu d'être supprimé.
  - `public/assets/js/dashboard/e-commerce.init.js` (vendor, cf. `PIEGES.md`) : les deux séries `ApexCharts`
    (`#average-line`/`#average-bar`) et les 7 lignes `gridjs` (`#gridjs_sort-table`) mises à `[]` — c'est là, pas dans
    `mockData.ts`, qu'étaient les vrais chiffres/noms inventés de `GraphSuivi`/`Transaction`.
  - `CustomerGrowth`/`LatestProduct`/`ProductStatistics.tsx` et `types/dashboard.ts` (`ProductCategory`/
    `CountryGrowth`/`CountryBubble`) restent supprimés : jamais importés par aucune page (re-vérifié par grep), donc
    pas concernés par « je ne vois plus les tableaux/graphe » — `Order`/`OrderStatus` restaurés dans `types/dashboard.ts`
    (nécessaires à `Account`/`AccountRow`).
- `components/sections/admin/dashboard/mockData.ts` : export `STATS` supprimé (mort, plus utilisé) — décision inchangée.

## Vérifié
- `tsc --noEmit`, `eslint`, `next build --turbopack` (route `/dashboard` bien dynamique, pas de pré-rendu statique —
  déjà couvert par `export const dynamic = "force-dynamic"` de `(admin)/layout.tsx`).
- `npm run test` : 14 suites / 48 tests, toujours au vert (aucun test ne portait sur le dashboard).
- Contre la pile de dev réelle (`docker`, conteneurs `cie-dev-api`/`cie-dev-admin-frontend`/`cie-dev-db` déjà en cours) :
  `GET /dashboard` renvoie bien les 3 valeurs à `0`/`0 FCFA` sur une base vide ; création d'un membre de test par l'API
  → la carte « Total membres » passe à `1` sans reload de conteneur (hot reload du bind mount `src/`) ; membre supprimé
  ensuite (base laissée propre). Après correction : re-vérifié en direct (conteneur `cie-dev-admin-frontend-1`, bind
  mount `public/` en plus de `src/`) que les 3 cartes sont bien présentes (« Comptes Admin », « Transactions »,
  « Graphe de suivi ») mais sans aucune ligne/valeur inventée (ni « MacBook Air », ni « Robert … $50.86 »).

## À faire (pas dans ce lot)
- Idem pour les autres pages encore en mock : `activity`, `member`, `treasury`, `archiver`, `about` ; `project` et
  `calendar` n'ont aucune donnée du tout. Même schéma que le dashboard : brancher si possible, retirer sinon plutôt
  que de garder des données inventées.
