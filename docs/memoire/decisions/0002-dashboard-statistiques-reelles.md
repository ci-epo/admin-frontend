# 0002 — Tableau de bord : statistiques branchées sur l'API réelle, données statiques vidées (pas les sections)

Statut : appliquée (2026-09-26). API : `app-service` (`members`, `projects`, `accounts`).

## Décisions

- **Seules les 3 cartes `StatsRow` sont branchées** (`Total membres`, `Projets`, `Caisse`) : ce sont les seules données du
  dashboard qui correspondent à un champ réel côté `app-service`.
- **`Account` (tableau « Comptes Admin »), `GraphSuivi` et `Transaction` restent affichés** — un premier essai les avait
  supprimés entièrement, corrigé sur retour utilisateur (« j'ai demandé d'effacer les données statiques, pas de tout
  supprimer », 2026-09-26) : demander de retirer les données mock ne voulait pas dire retirer la carte. Ces 3 sections
  restent donc en place, mais **vidées de toute donnée inventée** au lieu d'être branchées (voir « Hors périmètre »
  pour pourquoi elles ne peuvent pas l'être) :
  - `Account` : `mockData.ts` exporte toujours `ORDERS`, mais **vide (`[]`)** au lieu des 5 lignes fictives — le
    tableau affiche « Aucun résultat » (`TableFooter`) plutôt que des comptes qui n'existent pas.
  - `GraphSuivi` / `Transaction` : les données statiques n'étaient pas dans `mockData.ts` mais codées en dur dans le
    script vendor `public/assets/js/dashboard/e-commerce.init.js` (deux séries `ApexCharts` de ventes fictives, 7
    lignes `gridjs` avec des noms et des montants inventés). Ce fichier a été édité pour vider ces tableaux
    (`data: []`) — les cartes s'affichent donc vides plutôt qu'avec des chiffres inventés, sans changer la structure
    du script ni les colonnes/légendes.
  - `CustomerGrowth.tsx`/`LatestProduct.tsx`/`ProductStatistics.tsx` restent supprimés : contrairement aux trois
    ci-dessus, ils n'étaient importés par aucune page (vérifié par grep) — ce n'est pas de la donnée statique retirée
    d'une section visible, c'est du code mort qui n'affichait déjà rien.
- **`lib/api/dashboard.endpoints.ts`** : `getMembersTotal()` (`GET /members?limit=1`, ne lit que `total`),
  `getProjectsTotals()` (total + `isPublic=true` en parallèle), `getTreasuryBalance()` (`GET /accounts`, somme des
  `balance` de toutes les pages — prévu pour largement plus de 100 comptes, ce qui n'arrivera pas en pratique).
- **`lib/schemas/dashboard.schema.ts`** : validation à la main (même style que `backup.schema.ts` /
  `site-settings.schema.ts`), pas de Zod.
- **`lib/api/dashboard.loader.ts`** : les 3 appels sont indépendants (`Promise.all` sur 3 `.catch()` séparés) — l'échec
  d'un seul (ex. `app-service` injoignable) affiche une carte « Indisponible » sans faire échouer toute la page, même
  logique que `getAdminSettingsOrDefault()`.
- **Aucune tendance ("+8 % vs an dernier") ni statut "en cours/terminé"** : `app-service` n'expose pas ces champs
  (`ResponseProjectDto` n'a que `isPublic`, pas de statut de complétion) — inventer une valeur aurait été un mensonge
  d'UI. `trend` est mis à `"none"` sur les 3 cartes plutôt que de garder le `"up"`/`"down"` fictif du mock.
- **Pas de nouvelle route ni de jeton** : ces 3 endpoints sont publics côté `app-service` (comme `site-settings/web`),
  contrairement à `/administration` qui exige `ADMIN_API_TOKEN`.

## Hors périmètre (pourquoi)

- **`Account` (tableau « Comptes Admin »)** — **corrigé par la décision 0003** : cette section affirmait que
  `office-assignments` ne renvoie que des ids internes non résolubles. C'était faux — vérifié après coup dans
  `schema.prisma` : `member_id`/`position_id`/`mandate_id` sont des FK vers `public_id`, donc de vrais `publicId`
  résolubles via `GET /members`, `/positions`, `/mandates`. `Account` a été branché dans la foulée (voir 0003).
- **`GraphSuivi` / `Transaction`** : contenu généré par les scripts vendor du thème (`e-commerce.init.js`,
  `gridjs.umd.js` ciblant `#average-line`/`#average-bar`/`#gridjs_sort-table`, cf. `PIEGES.md`), pas par des props
  React — les brancher demanderait de remplacer ces scripts, pas juste d'appeler l'API. Ça reste hors périmètre.
