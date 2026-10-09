# 2026-09-28 — Page « Activités » branchée sur l'API réelle

Demande : « implemente la page activites de admin-frontend » (avec capture d'écran du rendu mock actuel : cartes
avec image, badge, description, bouton « Buy Now », footer libre).

- Constat de départ : `ActivityTable` (`schema.prisma`) n'a ni image ni footer libre — juste `mandateId`/
  `trainerId`/`scheduleId` (trois clés étrangères, publicId nanoid) + `name`/`type`/`description`. Écart avec le
  mock plus important que pour `Membres` (décision 0005) : trois relations à résoudre plutôt qu'un simple champ
  `type` à ajouter.
- Carte repensée sans image (aucun champ ne la couvre) : titre + badge de type, description, et en pied de carte
  créneau/formateur/mandat résolus en libellés (comme `Account`/`Membres` résolvent déjà `positionId`/`memberId`/
  `mandateId`, décision 0003).
- Réutilisation de `listMandateOptions`/`listMemberOptions` (`office-assignment.endpoints.ts`, déjà chargés pour le
  formulaire « Comptes Admin ») plutôt que dupliqués ; ajout de `listScheduleOptions` (nouveau, `schedules` n'était
  utilisé par aucune page avant celle-ci).
- CRUD complet (Ajouter/Modifier/Supprimer), recherche et pagination (6/page) ajoutées à la page, absentes du mock.
- Détail dans la décision [0006](../decisions/0006-page-activites-branchee.md).
- Vérifié contre la pile de dev réelle (`docker`, conteneurs `cie-*`) : créneau + activité de test créés par l'API,
  `GET /activity` confirme le rendu correct (badge, description, créneau/formateur/mandat résolus), puis supprimés —
  base revenue à son état initial.
