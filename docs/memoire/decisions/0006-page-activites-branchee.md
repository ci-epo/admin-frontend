# 0006 — Page « Activités » branchée sur l'API réelle (CRUD complet)

Statut : appliquée (2026-09-28). API : `app-service` (`activities`, `mandates`, `members`, `schedules`), aucune
modification côté `app-service`.

## Contexte

Le mock (`Activity` : `id`, `imageSrc`, `imageAlt`, `title`, `description`, `footer`) ne correspond à aucun champ
réel : `ActivityTable` (`schema.prisma`) n'a ni image ni « footer » (texte libre du type « Inscriptions ouvertes ! »),
et porte à la place trois clés étrangères obligatoires — `mandate_id`, `trainer_id` (un membre), `schedule_id` (un
créneau, seule vraie relation Prisma — `mandate_id`/`trainer_id` sont des `publicId` non contraints en base, comme
`memberId`/`positionId`/`mandateId` d'`office-assignments`, décision 0003) — plus `name`/`type`
(`CONTEST`/`TRAINING`/`PROJECT`)/`description` (optionnelle).

## Décisions

- **Pas d'image, pas de « footer » libre** : retirés faute de champ réel, plutôt qu'une photo ou un texte inventés
  (même logique que « Classe »/« Statut » retirés ailleurs, décisions 0003/0005). La carte (`ui/card/ActivityCard.tsx`,
  réécrite — n'était utilisée que par cette page) affiche à la place : titre + badge de type (`StatusBadge`,
  `Compétition`/`Formation`/`Projet`), description (ou « Aucune description. »), et en pied de carte le créneau
  (date + horaires + lieu), le formateur et le mandat — les trois champs réellement stockés, résolus en libellés.
- **Formulaires avec de vrais `<select>`**, pas de champs texte pour les ids : `mandateId`/`trainerId`/`scheduleId`
  viennent de menus remplis par les options déjà chargées (mêmes `SelectOption`/`listMandateOptions`/
  `listMemberOptions` que le formulaire « Comptes Admin », réutilisés depuis `office-assignment.endpoints.ts` plutôt
  que dupliqués), plus un nouveau `listScheduleOptions` (`lib/api/activity.endpoints.ts`, libellé
  `date · début–fin · lieu`). Si aucun mandat/membre/créneau n'existe encore, le formulaire l'indique au lieu
  d'afficher des `<select>` vides (même garde-fou qu'`AddOfficeAssignmentModal`).
- **Pas d'appel par carte** : `lib/api/activity.loader.ts` charge une fois `activities`/`mandates`/`members`/
  `schedules` et résout les ids de chaque activité par recherche en mémoire (même schéma que
  `office-assignment.loader.ts`, décision 0003).
- **`description` absente du JSON quand vide, jamais `null`** : `ActivityDbMapper.toDomain` renvoie
  `description: undefined` (pas `null`), donc la clé est absente de la réponse HTTP (`JSON.stringify` omet
  `undefined`). `readNullableString` (guards.ts) suppose une clé présente valant `null` ou une chaîne — insuffisant
  ici. Ajout de `readOptionalString` (générique, réutilisable) : clé absente → `undefined`, sinon chaîne stricte.
- **CRUD complet** : Ajouter/Modifier/Supprimer réels (`POST`/`PATCH`/`DELETE /activities/:publicId`, publics comme
  `members`/`projects`), menu « ⋮ » par carte (calqué sur `RowActions`, mais intégré à `ActivityCard` puisque la
  carte n'a pas de ligne de tableau pour le porter). Erreurs métier mappées par
  `lib/mappers/activity-error.mapper.ts` (`ACTIVITY_NAME_REQUIRED`, `ACTIVITY_*_ID_INVALID`,
  `ACTIVITY_TRAINER_SCHEDULE_CONFLICT`, `ACTIVITY_NOT_MODIFIABLE_AFTER_SCHEDULE`, `ACTIVITY_NOT_FOUND`) — ces deux
  derniers codes existent côté domaine (`activity.policies.ts`) mais ne sont déclenchés par aucun cas d'usage actuel
  (`create`/`update-activity.usecase.ts` ne les appellent pas) : mappés par prudence, sans garantie qu'`app-service`
  les renvoie un jour tels quels.
- **Recherche et pagination réelles, ajoutées** (absentes du mock) : `ActivityBoard.tsx` (nouveau, calqué sur
  `MemberTable`/`Account`) filtre sur nom/type/formateur/mandat/créneau/description (`filterBySearch`) et pagine à
  6/page (`usePagination` + `TableFooter`, adapté à une grille plutôt qu'un tableau) ; `EmptyState` distingue liste
  vide et recherche sans résultat.

## Vérifié

`npx tsc --noEmit`, `npm run lint` (0 erreur), `npm run test` (15 suites / 54 tests, 0 régression),
`next build --turbopack` (`/activity` reste `ƒ` dynamique). **Contre la pile de dev réelle** (`docker`, conteneurs
`cie-*`, déjà en route) : créneau + activité de test créés par l'API (`mandateId`/`trainerId` = le seul mandat/membre
réels de la base), `GET /activity` (rechargé à chaud, pas de redémarrage) confirme la carte rendue avec le bon badge
de type, la bonne description et les trois libellés résolus (créneau/formateur/mandat) ; activité puis créneau de
test supprimés ensuite, base revenue à son état initial (vide).

## Hors périmètre

- Suite de tests dédiée (`activity.schema.ts`/`activity-error.mapper.ts`) : pas demandée, aucun précédent équivalent
  pour `office-assignment.schema.ts`/`member.schema.ts` non plus.
- Filtre par type côté page (comme le filtre Type de `Membres`) : pas demandé : la recherche libre couvre déjà le
  type (le mot « formation » trouve les activités de type `TRAINING`).
- Vue détail d'une activité (participants, liste de présence) : hors périmètre de cette page.
