# 0003 — « Comptes Admin » branché sur `office-assignments`, bouton Ajouter

Statut : appliquée (2026-09-26). API : `app-service` (`office-assignments`, `members`, `positions`, `mandates`).

## Contexte

La décision 0002 classait `Account` (tableau « Comptes Admin ») comme non branchable : `memberId`/`positionId`/
`mandateId` renvoyés par `GET /office-assignments` y étaient pris pour des ids internes (en s'appuyant sur la
convention générale du dépôt racine, « les clés étrangères réfèrent à l'id interne, pas au publicId »). En
implémentant le bouton « Ajouter » demandé par l'utilisateur, vérification faite dans
`app-service/src/infrastructure/database/prisma/schema.prisma` : la table `OfficeAssignmentTable` déclare
`member Member @relation(fields: [member_id], references: [public_id])` (idem position/mandate) — la FK cible bien
`public_id`. Ce sont donc de vrais `publicId`, résolubles via les endpoints publics existants. La décision 0002 était
fausse sur ce point (corrigée en conséquence) ; « Classe » (aucun champ `Member` ne la couvre) reste, elle, réellement
absente du domaine.

## Décisions

- **Colonnes réelles** : Poste (`position.name`), Membre (`${firstName} ${name}`), Téléphone (`member.phoneNumber`),
  Statut (calculé — `beginDate <= aujourd'hui <= endDate`, pas un champ stocké), Mandat (`mandate.label`). « Classe »
  supprimée (aucune correspondance possible) plutôt que laissée vide ou inventée.
- **Pas d'appel par ligne** : `lib/api/office-assignment.loader.ts` charge une fois `members`/`positions`/`mandates`
  (déjà nécessaires comme options du formulaire d'ajout) et résout les ids de chaque affectation par recherche dans
  ces listes en mémoire, plutôt que par un `GET /members/:id` par ligne affichée.
- **Bouton Ajouter** : `TableToolbar` gagne une prop `onAdd?: () => void`, optionnelle et sans effet si absente
  (`Membres`/`Trésorerie` gardent leur bouton décoratif, aucune régression). `Account.tsx` (client) garde l'état
  d'ouverture du modal et rend `AddOfficeAssignmentModal` (calqué sur `BackupRestoreDialog` : `Modal` + `useActionForm`
  + `FormFeedback` + `SubmitButton`, mêmes composants que la page Administration).
- **Formulaire** : `<select>` natifs pour membre/poste/mandat (les options viennent de `office-assignment.loader.ts`),
  deux `<input type=date>` pour `beginDate`/`endDate`. Validation à la main dans
  `lib/schemas/office-assignment.schema.ts` (`parseCreateOfficeAssignmentForm`, même style que
  `parseWebSettingsForm`) : champs requis, `endDate >= beginDate`. Si aucun membre/poste/mandat n'existe encore, le
  formulaire l'indique au lieu d'afficher des `<select>` vides.
- **Server Action** : `app/(admin)/dashboard/dashboard.actions.ts` (`createOfficeAssignmentAction`) —
  `POST /office-assignments` (public, sans jeton, comme `members`/`projects`), puis `revalidatePath("/dashboard")`.
  Les erreurs métier (`DUPLICATE_OFFICE_ASSIGNMENT`, `*_NOT_FOUND`, `*_ID_INVALID`, `DATE_RANGE_INVALID`…) sont
  mappées en français par `lib/mappers/office-assignment-error.mapper.ts`, avec le champ fautif mis en rouge quand
  ça a du sens (ex. `DATE_RANGE_INVALID` → `endDate`).
- **Pas d'actions de ligne (modifier/supprimer)** : la demande portait sur le bouton Ajouter uniquement ; l'ancien
  menu déroulant de `AccountRow` (« Modifier »/« Voir »/« Changer le statut ») était déjà décoratif (aucun `onClick`)
  et a été retiré plutôt que gardé tel quel — il n'avait aucun sens pour ces données (« Changer le statut » alors que
  le statut est calculé des dates, pas un champ à basculer). Non fait, pas demandé : suppression d'une affectation,
  édition, filtre « Actuel bureau / Ancien bureau » (celui de l'ancien `TableToolbar` ne correspondait à aucun champ
  réel et a été retiré avec le reste du mock).

## Vérifié

Contre la pile de dev réelle (`docker`, conteneurs `cie-dev-*`) : création d'un membre + poste + mandat de test par
l'API, `GET /dashboard` affiche bien leurs noms dans le tableau et dans les `<select>` du formulaire d'ajout ;
`POST /office-assignments` direct (simulant la Server Action) → la ligne apparaît avec le bon statut calculé
(« Inactif », le mandat de test étant déjà expiré à la date du jour) ; toutes les données de test supprimées ensuite.
Une instabilité passagère d'`app-service` (`P2028 Unable to start a transaction`, `HeadersTimeoutError`) causée par le
volume de requêtes de test envoyées en rafale a été observée puis a disparu d'elle-même (charge CPU/mémoire des
conteneurs revenue à la normale) — non liée au code ; le repli « Indisponible » du dashboard l'a absorbée sans page
blanche pendant l'incident.
