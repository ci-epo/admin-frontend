# 2026-09-28 — Page « Calendrier » branchée sur l'API réelle

Suite directe de la page Activités (décision 0006, journal du même jour) : la modale « Ajouter une activité »
affichait « Il faut au moins un mandat, un membre et un créneau enregistrés » — vrai à ce moment-là, aucune page ne
permettait de créer un créneau (`/calendar` restait une démo FullCalendar vanilla, jamais branchée). Question posée à
l'utilisateur : créer un créneau de test par l'API pour débloquer tout de suite, ou brancher `/calendar`. Choix :
brancher `/calendar`.

- Constat : la démo (`apps-calendar.init.js`) n'avait aucun rapport avec `ScheduleTable` — 15 événements factices en
  mémoire (titre/libellé/description libres, glisser-déposer de gabarits « Formation »/« Meeting »…), un formulaire
  entièrement piloté par le script vendor, rien de persisté. `Schedule` réel n'a ni titre ni libellé, juste
  date/horaires/lieu.
- Le calendrier visuel (FullCalendar) est gardé comme pure vue des créneaux réels ; toute création/modification/
  suppression passe désormais par de vraies modales React (comme `Activity`/`Membres`) et de vraies Server Actions,
  jamais par une mutation directe de l'instance FullCalendar. Le script vendor, réduit de ~250 à ~85 lignes, se
  contente de dispatcher deux événements DOM (clic sur une case vide / sur un événement) que React écoute pour
  ouvrir ses modales, et expose `setCieCalendarEvents` pour resynchroniser la grille après chaque Server Action.
- `lib/api/activity.loader.ts` réutilise le nouveau `listSchedules()`/`toScheduleOption()` pour le `<select>` Créneau
  du formulaire d'activité, plutôt que l'ancien code ad hoc de la décision 0006 (supprimé).
- Détail dans la décision [0007](../decisions/0007-page-calendrier-branchee.md).
- Vérifié contre la pile de dev réelle (`docker`, conteneurs `cie-*`) : créneau de test créé par l'API, `GET
  /calendar` confirme la prop reçue par le composant, puis supprimé — base revenue à son état initial. Pas de
  vérification en navigateur réel (aucun outil de navigateur dans cette session) : le rendu FullCalendar et les
  clics restent à confirmer manuellement.
