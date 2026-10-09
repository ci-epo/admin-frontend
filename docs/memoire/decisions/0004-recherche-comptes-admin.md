# 0004 — Barre de recherche du tableau « Comptes Admin »

Statut : appliquée (2026-09-26).

## Contexte

`TableToolbar` avait déjà un champ de recherche (`InputIcon type="search"`), mais purement décoratif : aucune prop
ne permettait de lire sa valeur ni de filtrer quoi que ce soit (noté dans `ETAT.md`, « Filtres / recherche des
tableaux : l'UI est en place mais non fonctionnelle »). Demande : « implemente la barre de recherche », sans
préciser un tableau — `Account` (« Comptes Admin ») est le seul tableau du dashboard déjà branché sur des données
réelles (décision 0003), donc le seul où une recherche a un effet observable ; `Membres`/`Trésorerie` restent sur
`mockData.ts` et gardent leur champ décoratif (même logique que pour `onAdd` en 0003 : prop optionnelle, aucune
régression si non fournie).

## Décisions

- **Filtre générique et pur** : `lib/utils/text-search.ts` (`normalizeSearchText`, `filterBySearch`) — retire accents
  et casse (`NFD` + suppression des marques diacritiques), découpe la saisie en mots, exige que chaque mot apparaisse
  dans au moins un des champs fournis par un sélecteur `fields(item)`. Testé unitairement
  (`__tests__/units/lib/utils/text-search.spec.ts`) : accents/casse, numéro partiel, plusieurs mots, saisie vide.
- **`TableToolbar` reste rétro-compatible** : `searchValue`/`onSearchChange` optionnels, appliqués au champ existant
  uniquement quand `onSearchChange` est fourni (sinon champ non contrôlé, comportement historique inchangé pour
  `Membres`/`Trésorerie`).
- **`Account.tsx`** : état `query` local, filtre (`useMemo`) appliqué **avant** `usePagination` (pas de recherche
  côté API — les données sont déjà toutes chargées côté client, comme le reste du tableau), remise à la page 1 à
  chaque frappe. Champs couverts : poste, membre, téléphone, mandat, et le statut affiché (« Actif »/« Inactif »,
  pas les dates brutes) — une recherche sur « inactif » doit trouver la même chose que ce que l'utilisateur voit.
- **Message vide distinct** : `TableFooter` reçoit un `emptyLabel` qui dépend du contexte — « Aucune affectation
  enregistrée » si la liste réelle est vide, « Aucun résultat pour « *saisie* » » si le filtre ne trouve rien
  (`rows.length > 0` distingue les deux cas), pour ne pas laisser croire que le bureau est vide alors que c'est la
  recherche qui ne matche rien.
- **Non fait, pas demandé** : recherche côté serveur/API, filtres des menus déroulants de `TableToolbar` (toujours
  décoratifs), et branchement de la recherche sur `Membres`/`Trésorerie` (données encore mockées — même repli que
  pour le reste du dashboard, cf. `ETAT.md`).

## Vérifié

`tsc --noEmit`, `eslint` (fichiers touchés) et `npm run test` (54/54) : OK. `next build --turbopack` : OK,
`/dashboard` reste dynamique (`ƒ`). Contre la pile de dev réelle (Playwright headless, `docker`) : recherche par
« sissao », « EXTÉRIEUR » (accentué/majuscule), un numéro de téléphone partiel et deux mots (« sissao 2025`) trouvent
toutes la ligne SISSAO → CR-EXT ; une saisie sans correspondance (« zzz ») vide le tableau et affiche « Aucun
résultat pour « zzz » » ; effacer le champ restaure la ligne et le pied « 1–1 sur 1 ».
