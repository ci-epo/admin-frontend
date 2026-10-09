# État de admin-frontend

Dernière mise à jour : 2026-10-03

## Projets branchés : liste, ajout, modification, suppression (2026-10-03, priorité 6)

- `/project` branché sur `app-service` (`/projects`) : tableau avec recherche, pagination 10/page, visibilité, liens
  GitHub et démo. Server Actions dans `app/(admin)/project/project.actions.ts`, erreurs mappées par
  `lib/mappers/project-error.mapper.ts`. Entrée « Projets » ajoutée au menu (permission `page:project`).
- Tags : cases à cocher dans le formulaire projet (ajout et modification, diff via `syncProjectTags`), badges dans le
  tableau, recherche par tag. Section « Tags » sur la même page : ajout, modification, suppression (un tag supprimé est
  retiré de tous les projets, la boîte de suppression l'indique). Liaisons : `lib/api/project-tag.endpoints.ts`.
- La technologie n'est pas saisie : l'API ne donne pas de nom aux technologies et aucune ne peut être créée par l'API.
  Un projet créé ici reste sans technologie ; modifier un projet ne change pas sa technologie.
- Lien GitHub et lien de démonstration : `http` ou `https` uniquement (vérifié côté formulaire).
- Vérifié côté API en tant qu'admin : création, modification, liste, suppression. Pas vérifié en navigateur.
- Vérifié côté API en tant qu'admin : tag, liaison, cascades. Pas vérifié en navigateur.

## Accès : rôles bureau et admin (2026-10-03)

- `(admin)/layout.tsx` et la connexion acceptent `bureau` et `admin` (`lib/auth/access-role.ts`).
- La page Administration n'est visible qu'avec la permission `page:administration`, donc le rôle `admin` (décision 0019 d'app-service).

## Administration : onglet « Rôles et permissions » (2026-10-03, priorité 5)

- `/administration?onglet=droits` : choix d'un rôle (`bureau`, `membre`, `invité`) ou d'un poste du bureau, puis
  cases à cocher des permissions du catalogue. Enregistrer n'envoie que les différences (`computePermissionChanges`,
  `lib/utils/permission-selection.ts`) : créations et suppressions de `role-permissions` / `position-permissions`.
- Lecture seule sans `manage:access` (l'API refuserait l'écriture) ; la page reste protégée par `page:administration`.
- Non fait : création/suppression de rôles et de permissions (le catalogue est seedé), dérogations par utilisateur
  (`permissions-overrides`) : pas d'écran, à faire si besoin.
- **Pourquoi l'onglet « Administration » a disparu du menu** : le menu et la page exigent `page:administration`, que
  le compte de développement (« Chargé des Relations Extérieures ») n'a pas. Ce n'est pas un bug : il faut lui
  accorder la permission (poste Président, ou dérogation `permissions-overrides`), décision du bureau.
- Pas vérifié en navigateur. Les lectures et le refus d'écriture 403 ont été vérifiés contre l'API.

## Archives : faux documents retirés (2026-10-03, priorité 3)

- `/archiver` n'affiche plus les 300 lignes de `archive/mockData.ts` (faux documents visibles par de vrais
  utilisateurs). État vide « Aucune archive pour le moment » (même patron que `/project`) ; le contrôle de module
  désactivé est conservé. **Aucune archive n'existe côté `app-service`** : `ArchiveHero`, `ArchiveCatalogue` et
  `archive/mockData.ts` ne sont plus importés, à supprimer quand le module sera conçu.
- `/about` reste sur `about/mockData.ts`. Ce n'est pas une donnée du club mais du texte de présentation : à relire
  (licence « MIT », version et date « Mai 2025 » ne sont pas vérifiées dans le dépôt).

## Affectations du bureau : modifier et supprimer (2026-10-03)

- Le tableau « Comptes Admin » du dashboard gagne un menu « ⋮ » par ligne : **Modifier** (poste, mandat, dates) et
  **Supprimer** (confirmation). Server Actions `updateOfficeAssignmentAction` / `deleteOfficeAssignmentAction`
  (`app/(admin)/dashboard/dashboard.actions.ts`), appels `PATCH`/`DELETE /office-assignments/:publicId`, revalidation
  de `/dashboard`. Erreurs mappées par `lib/mappers/office-assignment-error.mapper.ts`.
- **Le membre n'est pas modifiable depuis l'interface** : `app-service` accepte un changement de `memberId` en
  `PATCH`, mais ne resynchronise pas `user_roleTable` (ni l'ancien membre, ni le nouveau). Pour éviter cette
  incohérence, la modale n'expose que poste, mandat et dates. Détail dans `PIEGES.md`.
- Vérifié contre la pile réelle : `PATCH` (poste + dates) → 200, plage inversée → 400 `DATE_RANGE_INVALID`,
  `DELETE` → 200, second `DELETE` → 404 `OFFICE_ASSIGNMENT_NOT_FOUND`. Affectation de test supprimée ensuite.
- **Modification de transaction : non faite.** La décision « une écriture comptable se corrige par une nouvelle
  écriture » (section Trésorerie ci-dessous) reste en vigueur tant que vous ne la changez pas.
- Pas vérifié en navigateur (modale, menu Bootstrap).

## Connexion réelle (bureau), menu filtré par permission, jeton d'administration retiré (2026-10-02)

Décision 0009, en miroir du système de rôles d'`app-service` (décision 0015 de ce dépôt voisin : rôles
`bureau`/`membre`/`invité`, **seul le bureau accède à `admin-frontend`**). `(auth)/login` est maintenant un vrai
formulaire (e-mail/mot de passe, refuse tout compte non `bureau`) ; la session (jeton d'accès + jeton de
rafraîchissement, `lib/auth/session.ts`) est rafraîchie silencieusement par un nouveau `src/middleware.ts`.
**Toutes les routes de `(admin)` sont désormais protégées** par `(admin)/layout.tsx` (avant : seule
`/administration` l'était, par un jeton statique partagé) ; le menu est filtré par permission en plus des
modules désactivés (`withoutUnauthorizedModules`), `/treasury` et `/administration` revérifiant chacune leur
permission. `ADMIN_API_TOKEN`/`admin-session.ts`/`AdminAccessForm` supprimés ; « Verrouiller » remplacé par une
vraie déconnexion. Vérifié : `tsc`/`lint`/`test`/`next build` verts ; redirection `/dashboard` → `/login` sans
session confirmée sur la pile réelle. **Pas vérifié par clic réel en navigateur** (aucun outil de navigateur
disponible dans cette session) — voir `PIEGES.md`.

## Page Trésorerie branchée, création/suppression de transaction (2026-09-28)

- `/treasury` : branché sur `app-service` (`accounts`, `categories`, `operators`, `transactions`, décision 0008),
  **`app-service` modifié à cette occasion** (décision 0014 de ce dépôt : `Transaction` gagne un `amount`, ses FK
  `account_id`/`category_id`/`operator_id` référencent désormais `public_id` au lieu de l'`id` interne — elles
  violaient la contrainte FK Postgres avant, créer une transaction via l'API était impossible — et
  `AccountTable.balance` est maintenant tenu à jour à la création/suppression d'une transaction).
- Colonnes réelles : Date, Type (déduit de `category.type`), Nom/Contact (`Operator`), Objectif
  (`Transaction.description`), Montant (signé), Caisse (solde courant recalculé + nom du compte). « Rôle » et
  « Reçu » du mock retirés (aucun champ réel). Cartes stats réelles (solde consolidé, entrées/dépenses du mois vs.
  mois précédent).
- Ajouter une opération : Server Action `createTransactionAction`
  (`app/(admin)/treasury/treasury.actions.ts`) — crée d'abord l'opérateur (contrepartie : nom + téléphone, pas
  d'écran de gestion dédié, créé à la volée) puis la transaction. Supprimer : `deleteTransactionAction`. **Pas de
  modification de transaction** (décision assumée : une écriture comptable se corrige par une nouvelle écriture).
  Erreurs mappées par `lib/mappers/treasury-error.mapper.ts`.
- `Account`/`Category` sont de la vraie donnée de référence choisie dans un `<select>`, sans écran de gestion
  dédié : alimentées par les seeders `accounts`/`categories` ajoutés côté `app-service` (décision 0014). Recherche
  + filtre Type réels (même patron que `Membres`), filtre « Période » laissé décoratif.
- Vérifié contre la pile de dev réelle (conteneurs `cie-*`, déjà en route) : deux transactions de test créées par
  l'API (une entrée, une dépense), `GET /treasury` confirme montants signés et solde par ligne recalculé
  correctement, solde du compte revenu à 0 après suppression.

## Page Calendrier branchée, CRUD complet (2026-09-28)

- `/calendar` : branché sur `app-service` (`schedules`, décision 0007), aucune modification côté `app-service`.
  L'ancienne démo FullCalendar (15 événements factices en mémoire, jamais persistés, sans rapport avec
  `ScheduleTable`) est remplacée par une vraie vue des créneaux réels ; le calendrier visuel (FullCalendar) reste,
  mais ne fait plus que dispatcher des événements DOM (clic case vide / clic créneau) que React écoute pour ouvrir
  ses propres modales (`AddScheduleModal`/`EditScheduleModal`/`DeleteScheduleDialog`/`ScheduleDetailsModal`, calquées
  sur `Activity`/`Membres`).
- Ajouter/Modifier/Supprimer un créneau : Server Actions dans `app/(admin)/calendar/calendar.actions.ts`
  (`POST`/`PATCH`/`DELETE /schedules/:publicId`), erreurs mappées par `lib/mappers/schedule-error.mapper.ts`.
  `apps-calendar.init.js` (vendor) réduit de ~250 à ~85 lignes : plus de formulaire/modale/glisser-déposer/SweetAlert2
  côté vendor, juste `cieCalendarDateClicked`/`cieCalendarEventClicked` (dispatch) et `setCieCalendarEvents`
  (resynchronisation après chaque Server Action + `revalidatePath`).
- `lib/api/activity.loader.ts` (décision 0006) réutilise désormais `listSchedules()`/`toScheduleOption()`
  (`lib/api/schedule.endpoints.ts`/`lib/schemas/schedule.schema.ts`) pour le `<select>` Créneau du formulaire
  d'activité, à la place du code ad hoc de la décision 0006.
- **Pas de garde contre la suppression d'un créneau encore utilisé par une activité** (`app-service` ne l'anticipe
  pas, contrairement à `MEMBER_HAS_OFFICE_ASSIGNMENTS`) : remonterait l'erreur générique plutôt qu'un message
  explicite. Hors périmètre de cette demande, cf. décision 0007.
- Vérifié contre la pile de dev réelle (conteneurs `cie-*`, déjà en route) : créneau de test créé/supprimé par
  l'API, `GET /calendar` confirme la prop reçue. **Pas vérifié en navigateur réel** (rendu FullCalendar, clics) :
  aucun outil de navigateur dans cette session.

## Page Activités branchée, CRUD complet (2026-09-28)

- `/activity` : branché sur `app-service` (`activities` + `mandates` + `members` + `schedules`, décision 0006),
  aucune modification côté `app-service`. Cartes sans image ni « footer » libre (aucun champ `ActivityTable` ne les
  couvre) : titre + badge de type (Compétition/Formation/Projet), description, et en pied de carte le créneau
  (date + horaires + lieu), le formateur et le mandat, résolus depuis les trois clés étrangères réelles
  (`mandateId`/`trainerId`/`scheduleId`) sans appel par carte (`lib/api/activity.loader.ts`).
- Ajouter/Modifier/Supprimer une activité : Server Actions dans `app/(admin)/activity/activity.actions.ts`
  (`POST`/`PATCH`/`DELETE /activities/:publicId`), erreurs mappées par `lib/mappers/activity-error.mapper.ts`.
  Formulaires avec de vrais `<select>` mandat/formateur/créneau (`listMandateOptions`/`listMemberOptions` réutilisés
  depuis `office-assignment.endpoints.ts`, nouveau `listScheduleOptions`). Recherche + pagination client 6/page,
  ajoutées (absentes du mock).
- `lib/schemas/guards.ts` gagne `readOptionalString` (générique) : `ResponseActivityDto.description` est absente du
  JSON quand vide (`undefined`, jamais `null`) — `readNullableString` ne couvrait pas ce cas.
- Vérifié contre la pile de dev réelle (conteneurs `cie-*`, déjà en route) : créneau + activité de test créés par
  l'API, `GET /activity` confirme le rendu correct, données de test supprimées ensuite.

## Page Membres branchée, CRUD complet (2026-09-27)

- `/member` : branché sur `app-service` (`members` + `office-assignments`, décision 0005). Colonnes réelles : Nom,
  Contact (téléphone + e-mail), Type, Date (`createdAt`). « Statut » et l'avatar restent retirés (aucun champ
  `Member` ne les couvre, vérifié dans `schema.prisma`).
- **`app-service` modifié à cette occasion** : `MemberTable` gagne une colonne `type` réelle (enum
  `MEMBER`/`PARTNER`, défaut `MEMBER`) choisie à la création/modification d'un membre ; `ResponseMemberDto`/
  `MemberHttpMapper` exposent désormais `type` et `createdAt` (`createdAt` existait déjà dans `MemberEntity`/la
  table, jamais renvoyé par l'API avant). Schéma poussé sur la base de dev réelle (`docker restart cie-dev-api-1`,
  le conteneur relance `prisma db push` à son démarrage — pas de dossier `migrations/` dans ce projet).
- **Type affiché = 4 états, calculés en combinant ce champ et les affectations de bureau** (pas stockés) :
  Membre/Partenaire (champ réel) croisé avec Bureau/Ancien Bureau (affectation active / expirée) — détail et
  justification (retour utilisateur en testant sur la pile réelle) dans la décision 0005.
- Ajouter/Modifier/Supprimer un membre : Server Actions dans `app/(admin)/member/member.actions.ts`
  (`POST`/`PATCH`/`DELETE /members/:publicId`, publics comme `office-assignments`), erreurs mappées par
  `lib/mappers/member-error.mapper.ts`. Recherche + filtre Type réels, pagination client 20/page (pas de
  `table-responsive` sur ce tableau : pas de scroll interne), liste chargée une fois (`GET /members?limit=100`).
- `components/ui/dropdown/RowActions.tsx` (partagé avec `Trésorerie`, toujours décoratif là-bas) gagne un
  `onClick`/`danger` optionnel par action ; `components/ui/table/TableToolbar.tsx` gagne `value`/`onChange` optionnels
  par filtre — les deux rétro-compatibles, `Trésorerie` n'est pas affecté.
- Vérifié contre la pile de dev réelle (conteneurs `cie-dev-*`, déjà en route) : `curl` sur `app-service` et sur la
  page rendue par `admin-frontend` (rechargée à chaud, pas de redémarrage nécessaire).

## Recherche du tableau « Comptes Admin » (2026-09-26)

- Le champ de recherche de `TableToolbar` (décoratif jusqu'ici) filtre désormais réellement les lignes du tableau
  « Comptes Admin » (décision 0004) : `lib/utils/text-search.ts` (insensible accents/casse, tous les mots de la
  saisie), filtre appliqué avant pagination, remise à la page 1, message distinct « Aucun résultat pour … » vs.
  tableau vide. `TableToolbar` reste rétro-compatible (`searchValue`/`onSearchChange` optionnels) : les champs
  décoratifs de `Membres`/`Trésorerie` sont inchangés (données encore mockées, cf. plus bas).

## Tableau de bord — Comptes Admin branché + bouton Ajouter (2026-09-26)

- `/dashboard` : les 3 cartes `StatsRow` (Total membres, Projets, Caisse) lisent `app-service` (décision 0002, journal
  du 2026-09-26) via `lib/api/dashboard.endpoints.ts` + `dashboard.loader.ts`. Résilient carte par carte (« Indisponible »
  si un appel échoue). Vérifié contre la pile de dev réelle (comptage à jour après création/suppression d'un membre).
- **`Account` (tableau « Comptes Admin ») est maintenant branché sur `office-assignments`, avec un bouton « Ajouter »
  fonctionnel** (décision 0003, journal du 2026-09-26) : contrairement à ce qu'affirmait la décision 0002,
  `memberId`/`positionId`/`mandateId` sont bien des `publicId` (vérifié dans `schema.prisma` : la FK cible
  `public_id`, pas `id`) — donc résolubles en noms réels, pas des ids internes opaques. Colonnes réelles : Poste,
  Membre, Téléphone, Statut (calculé des dates, pas stocké), Mandat — « Classe » a été retirée (aucune donnée
  `Member` ne la couvre). Le formulaire d'ajout crée une affectation via `POST /office-assignments` (Server Action
  `createOfficeAssignmentAction`, `app/(admin)/dashboard/dashboard.actions.ts`) et revalide `/dashboard`.
- `GraphSuivi`/`Transaction` restent affichés mais vides (séries `ApexCharts`/lignes `gridjs` codées en dur dans le
  script vendor `e-commerce.init.js`, vidées à `data: []` — cf. `PIEGES.md`) : contenu généré par un script vendor,
  pas par des props React, donc pas branchable de la même façon que `Account`.
- `CustomerGrowth`/`LatestProduct`/`ProductStatistics.tsx` restent supprimés (jamais importés par aucune page — code
  mort, pas une section visible qu'on aurait vidée).

## Page Administration (2026-09-25, jeton remplacé par une permission le 2026-10-02)

- `/administration` : réglages du site public et de l'espace admin, sauvegardes / téléchargement / import / restauration
  de la base (décision 0001, journal du 2026-09-25). Premier écran branché sur l'API réelle (le reste est encore en
  `mockData.ts`). Accès protégé par la permission `page:administration` (connexion bureau, décision 0009) depuis le
  2026-10-02 — plus de jeton `ADMIN_API_TOKEN`.
- Variable serveur `API_INTERNAL_BASE_URL` (Compose : `http://api:3000/api`) ; `(admin)` est rendu à chaque requête.

## Docker (ajouté le 2026-09-21, depuis le dépôt `docker`)

- `Dockerfile` : `ARG`/`ENV NEXT_PUBLIC_API_BASE_URL` ajoutés avant `npm run build` (`docker/compose.prod.yaml` la fournit comme
  argument de build). Image construite et démarrée avec succès (`docker/tests/`, niveaux build/smoke/integration).
- **Faille de sécurité trouvée à cette occasion, non corrigée** : `github-deploy-key` (clé privée SSH) et `github-deploy-key.pub`
  sont **versionnés dans git**, non ignorés. Détail et action à mener : `PIEGES.md`.
- ~~`src/config/env.ts` lit `process.env[name]`~~ : accès littéral depuis le 2026-09-25.

## Vérifications (toutes vertes)

- `npx tsc --noEmit` : OK
- `npm run lint` : 0 erreur, 0 warning (le vendor `public/**` est ignoré)
- `npm run test` : 15 suites / 58 tests (Jest + RTL) : OK (2026-10-02)
- `next build --turbopack` : OK — il échouait avant à cause de pages vides ; `/dashboard` reste bien dynamique (`ƒ`)
- Smoke test `next start` : toutes les routes en 200, route inconnue en 404 (`not-found.tsx`), `/_next/image` sert les avatars

## Structure `src/`

- `app/` : `(admin)/` (dashboard, member, calendar, activity, treasury, archiver, about, project) + `(auth)/login`.
  Pages minces (assemblage), `loading.tsx` / `error.tsx` dans `(admin)/`, `not-found.tsx` à la racine.
- `components/sections/admin/<feature>/` : blocs métier, chacun < 150 lignes.
- `components/ui/` : design system léger. Nouveaux : `pagination` (contrôlé), `table/TableToolbar`, `table/TableFooter`,
  `dropdown/RowActions`, `badge/StatusBadge`, `empty-state/EmptyState`, `spinner/Spinner`.
- `hooks/` : `use-pagination`, `use-archive-filters`, `use-cie-calendar` (pont vers le script vanilla du calendrier).
- `lib/utils/` : `pagination`, `format-currency`, `calendar-events`, `archive-filters`, `vanilla-script` (fonctions pures, testées).
- `lib/api/` : `client.ts` (unique appelant de `fetch`) + `endpoints.ts` (healthcheck) + `administration.*` + `dashboard.*`.
- `types/` : `stat.ts` (StatItem unique), `calendar.ts`, `activity.ts`, etc.

## Garde-fous automatiques (`eslint.config.mjs`)

`no-restricted-imports` impose l'alias `@/…` (aucun `./` ni `../`) et les frontières de couches :
`types` ← rien ; `lib` ← types/config ; `hooks` ← lib/types ; `ui` ← types (+ autres `ui`) ; `sections` ← tout sauf `app`.

## Reste à faire

- Pages encore entièrement sur `mockData.ts` : `about` (`archiver` ne montre plus de faux documents depuis le 2026-10-03 ; `project` est branché). `member`
  (2026-09-27, décision 0005), `activity` (2026-09-28, décision 0006), `calendar` (2026-09-28, décision 0007) et
  `treasury` (2026-09-28, décision 0008) sont branchés. Même schéma que `dashboard`/`administration`/`member`/
  `activity`/`calendar`/`treasury` : `lib/api/<feature>.endpoints.ts` + `lib/schemas/` (validation à la main, comme
  `guards.ts` — Zod n'est pas installé, décision 0001) + `lib/mappers/`.
- Recherche des tableaux `Comptes Admin` (décision 0004), `Membres` (décision 0005) et `Trésorerie` (décision 0008)
  branchée. Menus déroulants de filtre (`TableToolbar`) : Type branché sur `Membres` et `Trésorerie` ; « Période »
  (`Trésorerie`) et les autres restent sans action (décoratifs).
- Pas de MSW ni de test d'intégration / e2e Playwright pour l'instant (`__tests__/integrations`, `__tests__/e2e` à créer).
- ~~Pas d'authentification par compte~~ **traité le 2026-10-02** (décision 0009) : connexion réelle, réservée au
  bureau ; toutes les routes de `(admin)` sont protégées, plus seulement `/administration`.
- `next/image` : quand les avatars viendront de l'API, déclarer `images.remotePatterns` dans `next.config.ts`.
- Textes hérités du thème en anglais (header : panier, notifications, menu profil ; `ActivityCard` « Buy Now »), liens
  `/pages/*`, `/auth/signout`, `/apps/ecommerce/*` qui pointent vers des routes inexistantes (404).
- `README.md` et `package.json` (`name: my_portfolio`) sont hérités d'un autre projet.
