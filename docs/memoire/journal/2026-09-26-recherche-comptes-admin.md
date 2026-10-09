# 2026-09-26 — Barre de recherche du tableau « Comptes Admin »

## Demande
« implemente la barre de recherche » — le champ de `TableToolbar` existait déjà visuellement mais n'avait aucun
effet (`ETAT.md` le listait dans « Reste à faire »).

## Fait
- `src/lib/utils/text-search.ts` : `normalizeSearchText` (accents/casse) + `filterBySearch` (tous les mots de la
  saisie doivent apparaître dans les champs fournis). Testé : `__tests__/units/lib/utils/text-search.spec.ts`.
- `TableToolbar` : props optionnelles `searchValue`/`onSearchChange` (rétro-compatible, `Membres`/`Trésorerie`
  inchangés).
- `Account.tsx` : filtre avant pagination, remise à la page 1 par frappe, message vide distinct (recherche sans
  résultat vs. tableau réellement vide), champs couverts = les 5 colonnes affichées (statut inclus, calculé).

Voir décision 0004 pour le détail et les résultats de vérification (Playwright headless contre la pile de dev
réelle, `tsc`/`eslint`/`npm test`/`next build`).
