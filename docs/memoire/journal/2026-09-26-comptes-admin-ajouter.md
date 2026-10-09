# 2026-09-26 — « Comptes Admin » branché, bouton Ajouter

## Fait
- `types/office-assignment.ts` (nouveau) : `SelectOption`, `MemberOption`, `OfficeAssignmentFormOptions`,
  `OfficeAssignmentRow`, `CreateOfficeAssignmentCommand`.
- `lib/schemas/office-assignment.schema.ts` (nouveau) : parseurs à la main pour les listes membres/postes/mandats/
  affectations, `parseCreateOfficeAssignmentForm` (validation du formulaire).
- `lib/api/office-assignment.endpoints.ts` (nouveau) : `listMemberOptions`, `listPositionOptions`,
  `listMandateOptions`, `listOfficeAssignments`, `createOfficeAssignment`.
- `lib/api/office-assignment.loader.ts` (nouveau) : `loadOfficeAssignmentBoard()` — charge les 4 listes en parallèle,
  résout les ids par recherche en mémoire (pas d'appel par ligne), calcule `active` depuis les dates. Résilient
  (`EMPTY_BOARD` si un appel échoue).
- `lib/mappers/office-assignment-error.mapper.ts` (nouveau) : codes métier `app-service` → messages français +
  champ fautif.
- `app/(admin)/dashboard/dashboard.actions.ts` (nouveau) : `createOfficeAssignmentAction` (Server Action,
  `revalidatePath("/dashboard")`).
- `components/ui/table/TableToolbar.tsx` : prop `onAdd?: () => void` ajoutée (optionnelle, aucun changement pour
  `Membres`/`Trésorerie` qui ne la passent pas).
- `components/sections/admin/dashboard/AddOfficeAssignmentModal.tsx` (nouveau) : modal calqué sur
  `BackupRestoreDialog` (`Modal` + `useActionForm` + `FormFeedback` + `SubmitButton`).
- `components/sections/admin/dashboard/Account.tsx` : réécrit — `"use client"`, garde l'état d'ouverture du modal,
  colonnes réelles (Poste/Membre/Téléphone/Statut/Mandat), plus de filtre décoratif.
- `components/sections/admin/dashboard/AccountRow.tsx` : réécrit pour `OfficeAssignmentRow` (plus de checkbox/avatar/
  menu d'actions décoratif — aucun de ces éléments n'avait de contrepartie réelle).
- `app/(admin)/dashboard/page.tsx` : charge `loadOfficeAssignmentBoard()` en plus de `loadDashboardStats()`, passe
  `rows`/`options`/`action` à `Account`.
- `mockData.ts` et `types/dashboard.ts` supprimés (plus aucun export utilisé — `Account` ne prend plus de données
  mock du tout, contrairement à la décision 0002 qui les avait vidés sans les retirer).
- Décision 0002 corrigée : sa raison de ne pas brancher `Account` (« ids internes non résolubles ») était fausse,
  voir décision 0003.

## Vérifié
- `tsc --noEmit`, `eslint` (une erreur `react/no-unescaped-entities` corrigée), `next build --turbopack`,
  `npm run test` (14 suites / 48 tests, toujours au vert).
- Contre la pile de dev réelle : membre + poste + mandat de test créés par l'API → apparaissent dans le tableau et
  les `<select>` du formulaire (`GET /dashboard`) ; `POST /office-assignments` direct → la ligne apparaît avec le
  statut calculé correctement (« Inactif », mandat de test déjà expiré) ; tout supprimé ensuite (base laissée propre).
- Repli « Indisponible » vérifié en conditions réelles : pendant une instabilité passagère d'`app-service` due au
  volume de requêtes de test (`P2028`, timeouts — resource, pas un bug), le dashboard a affiché les cartes
  indisponibles plutôt qu'une page blanche ; tout est revenu à la normale une fois la charge retombée.

## À faire (pas dans ce lot)
- Modifier/supprimer une affectation depuis le tableau : pas demandé, non fait (voir décision 0003).
- `GraphSuivi`/`Transaction` restent vides (données codées en dur dans le script vendor, pas des props React).
- Idem pages encore en mock : `activity`, `member`, `treasury`, `archiver`, `about` ; `project`/`calendar` n'ont
  aucune donnée.
