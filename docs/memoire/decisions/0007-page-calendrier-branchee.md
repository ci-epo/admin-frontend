# 0007 — Page « Calendrier » branchée sur l'API réelle (CRUD complet)

Statut : appliquée (2026-09-28). API : `app-service` (`schedules`), aucune modification côté `app-service`. Suite de
la décision 0006 : la modale d'ajout d'activité indiquait « Il faut au moins un mandat, un membre et un créneau
enregistrés » — aucune page n'exposait de créneau, `/calendar` étant resté un calendrier de démo vanilla, jamais
branché à aucune donnée réelle.

## Contexte

`AppCalendar`/`apps-calendar.init.js` était une démo FullCalendar entièrement vanilla : 15 événements factices
codés en dur (« World Braille Day », « Birthday Party »…), un formulaire piloté par le script vendor
(`#form-event`) créant des événements génériques (titre/libellé/description libres) **uniquement en mémoire JS**
(perdus au rechargement, jamais persistés). Aucun rapport avec `ScheduleTable` (`schema.prisma`), qui n'a ni titre
ni libellé — juste `date`/`beginHour`/`endHour`/`localisation` — et n'existe que pour être référencé par une
`Activity` (`scheduleId`). Écart plus radical qu'`Activity` (décision 0006) : pas seulement des champs en trop, une
page entièrement non branchée dont le modèle de données (événement libre) ne correspond à aucune entité du domaine.

## Décisions

- **Le calendrier visuel (FullCalendar) est gardé, mais devient une pure vue** : la grille affiche les créneaux
  réels (titre = `localisation`, horaires = `beginHour`/`endHour` combinés à `date`), mais ne les modifie plus jamais
  directement. `apps-calendar.init.js` réécrit de ~250 à ~85 lignes : `eventClick`/`dateClick` ne font plus que
  dispatcher `cieCalendarEventClicked`/`cieCalendarDateClicked` (`CustomEvent` sur `window`) ; plus de formulaire, de
  modale de détails, de glisser-déposer (`Draggable`/`eventReceive`) ni de SweetAlert2 côté vendor.
- **Les modales sont désormais de vraies modales React**, calquées sur le reste de l'admin
  (`Modal` + `useActionForm` + `FormFeedback` + `SubmitButton`, comme `Activity`/`Membres`) : `AddScheduleModal`,
  `EditScheduleModal`, `DeleteScheduleDialog`, `ScheduleDetailsModal` (nouveau : un clic sur un événement ouvre un
  résumé avec les boutons Modifier/Supprimer, avant les décisions Ajouter/Modifier/Supprimer). `CalendarEventFormModal`/
  `CalendarEventDetailsModal` (portées par des ids DOM fixes lus par le vendor) et `event-labels.ts` (styles/gabarits
  sans équivalent réel) sont supprimés.
- **Resynchronisation par la source de vérité, pas par mutation locale** : après un Ajouter/Modifier/Supprimer, la
  Server Action fait `revalidatePath("/calendar")` (même schéma que partout ailleurs) ; Next renvoie la prop
  `schedules` à jour au composant client déjà monté, et un nouvel effet de `useCieCalendar` appelle
  `setCieCalendarEvents` (nouveau, exposé par le vendor) pour remplacer la source d'événements de FullCalendar — pas
  d'ajout/édition optimiste côté client, la grille ne montre jamais que ce que l'API a confirmé.
- **`ui/card`… non, pas de nouveau composant `ui`** : tout le nouveau code vit dans `sections/admin/calendar` (feature
  propre à cette page) et `lib/api/schedule.*`/`lib/schemas/schedule.schema.ts`/`lib/mappers/schedule-error.mapper.ts`
  (même schéma que `member`/`activity`). `lib/api/activity.loader.ts` réutilise `listSchedules()` +
  `toScheduleOption()` (nouveau, `schedule.schema.ts`) pour le `<select>` Créneau du formulaire d'activité — l'ancien
  `listScheduleOptions`/`parseScheduleOptionListDto` (ad hoc dans `activity.*`, décision 0006) est supprimé, une
  seule source de vérité pour le parsing d'un `Schedule`.
- **Formulaire réel** : date + heure de début + heure de fin + lieu (`<input type="date"|"time">`), pas de titre ni
  de libellé (aucun champ `Schedule` ne les couvre). Validation à la main dans `lib/schemas/schedule.schema.ts`
  (requis + `beginHour < endHour`, miroir de `CreateScheduleValidator` côté `app-service`).
- **Suppression d'un créneau encore utilisé par une activité : pas de message métier dédié.** `ScheduleTable.schedule`
  est une vraie relation Prisma (`@relation`, contrainte `RESTRICT` implicite) mais
  `DeleteScheduleUseCase`/`ScheduleRepositoryAdapter` ne l'anticipent pas (pas de garde applicative, contrairement à
  `MEMBER_HAS_OFFICE_ASSIGNMENTS` pour les membres) : une suppression en conflit remonterait une erreur Prisma brute
  (`P2003`), non catégorisée par `BusinessErrorFilter`, affichée par `DeleteScheduleDialog` comme l'échec générique
  (« L'opération a échoué. Réessayez dans un instant. ») plutôt qu'un message explicite. Pas corrigé côté
  `app-service` : hors périmètre de cette demande (« brancher la page Calendrier »), à traiter si l'utilisateur le
  signale.

## Vérifié

`npx tsc --noEmit`, `npm run lint` (0 erreur), `npm run test` (15 suites / 55 tests, +1 nouveau test pour
`toScheduleCalendarEvents`, 0 régression), `next build --turbopack` (`/calendar` reste `ƒ` dynamique),
`node --check apps-calendar.init.js` (syntaxe). **Contre la pile de dev réelle** (`docker`, conteneurs `cie-*`, déjà
en route) : créneau de test créé par l'API, `GET /calendar` confirme la prop `schedules` reçue par le composant
client avec les bonnes données ; supprimé ensuite, base revenue à son état initial. **Non vérifié en navigateur réel**
(pas d'outil de navigateur disponible dans cette session) : l'exécution effective de FullCalendar (rendu de la
grille, clic sur une case/un événement, resynchronisation visuelle après une Server Action) repose sur du JavaScript
qui ne s'exécute qu'côté client — à confirmer manuellement avant de considérer le parcours complet comme validé.

## Hors périmètre

- Garde applicative contre la suppression d'un créneau utilisé par une activité (cf. ci-dessus).
- Édition directe sur la grille (glisser-déposer pour changer la date/l'heure) : retirée avec le vendor
  (`editable`/`droppable` mis à `false`), pas redemandée sous cette forme — toute modification passe par
  `EditScheduleModal`.
- Filtre par lieu/date sur la page (comme le filtre Type de `Membres`) : pas demandé.
- Vue « planning » alternative (semaine/jour) : `initialView` reste `dayGridMonth`, comme la démo d'origine.
