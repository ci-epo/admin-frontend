# 0005 — Page « Membres » branchée sur l'API réelle (CRUD complet)

Statut : appliquée (2026-09-27, corrigée le même jour après retour utilisateur sur la pile réelle). API :
`app-service` (`members`, `office-assignments`) + `app-service` modifié (`MemberTable` gagne une colonne `type`,
`ResponseMemberDto` gagne `type` et `createdAt`).

## Contexte

Le mock (`Member` : `id`, `nom`, `contact`, `type`, `status`, `date`, `avatarUrl`) ne correspond pas au domaine
réel : `MemberTable` (`schema.prisma`) n'avait que `name`/`first_name`/`phone_number`/`email`/`created_at`. Ni
`type` (Membre/Bureau/Partenaire/Visiteur) ni `status` (Actif/Inactif) n'existaient côté backend, et
`ResponseMemberDto` n'exposait même pas `created_at`.

Premier passage (branchement en lecture/CRUD simple) : « Bureau » calculé des affectations actives, « Statut »/
« Partenaire »/« Visiteur »/avatar retirés faute de champ réel, pagination client à 8/page, pas de filtre
`TableToolbar` (décoratifs partout ailleurs). **Corrigé après test sur la pile de dev réelle** (retour utilisateur,
capture d'écran de `/member`) : cf. « Décisions » ci-dessous pour l'état final.

## Décisions

- **Colonnes réelles** : Nom (`${firstName} ${name}`), Contact (téléphone + e-mail, deux lignes), Type, Date
  (`createdAt`). « Statut » et l'avatar restent retirés (aucun champ ne les couvre) — même logique que « Classe »
  retirée du tableau « Comptes Admin » (décision 0003).
- **`type` est un vrai champ `Member`, pas seulement calculé** : ajouté à `MemberTable` (`schema.prisma`,
  `enum MemberTypeEnum { MEMBER @map("membre") PARTNER @map("partenaire") }`, colonne `type` `@default(MEMBER)`) et
  à toute la chaîne `app-service` (`MemberEntity`, `member-bd.mapper.ts`, `CreateMemberCommand`/`UpdateMemberCommand`,
  `CreateMemberDto`/`UpdateMemberDto` (`@IsEnum`, optionnel), `ResponseMemberDto`, `member-http.mapper.ts`,
  `create-member.usecase.ts` défaut `MEMBER` si omis). Choisi à la création/modification d'un membre (`<select>`
  Membre/Partenaire dans `AddMemberModal`/`EditMemberModal`) — motif : le premier passage avait classé « Partenaire »
  comme non branchable (aucun champ), mais l'utilisateur a explicitement demandé un filtre Membre/Bureau/Partenaire
  réel ; ajouter le champ était la seule façon honnête de le satisfaire (pas de filtre décoratif sur des catégories
  qui n'existent pas). **Schéma poussé sur la base de dev réelle** (`docker restart cie-dev-api-1` — le conteneur
  `cie-dev` (nom de projet Compose réel, différent du `name: cie` du fichier) exécute `prisma generate && prisma db
  push` à chaque démarrage, pas de dossier `migrations/`) ; vérifié par `curl http://localhost:3000/api/members` :
  le membre existant est bien réapparu avec `"type":"MEMBER"` (valeur par défaut).
- **Type affiché = 4 états, combinant le champ réel et les affectations (toujours calculées, jamais stockées)** :
  - `Partenaire` si `type === "PARTNER"` (jamais recatégorisé par une affectation — un partenaire n'occupe pas de
    poste) ;
  - sinon `Bureau` si une affectation de bureau couvre aujourd'hui (`beginDate <= aujourd'hui <= endDate`) ;
  - `Ancien Bureau` (nouveau, demandé par l'utilisateur) s'il a eu une affectation mais qu'elle est expirée — cas
    réel rencontré en testant : le mandat de l'unique membre de la base de dev s'est terminé le 31/08/2026, or on
    est le 27/09/2026, donc son affectation est réellement expirée (pas un bug de calcul) ; l'utilisateur a choisi
    de distinguer ce cas plutôt que de le confondre avec un simple « Membre » ou de considérer les affectations
    expirées comme toujours actives ;
  - `Membre` sinon (jamais eu d'affectation).
  `member.loader.ts` réutilise `listOfficeAssignments()` (déjà utilisé par le dashboard) pour construire ces deux
  ensembles (`activeMemberIds`, `everAssignedMemberIds`) en mémoire. Les deux appels (`members`,
  `office-assignments`) restent indépendants : si les affectations échouent, la liste s'affiche quand même, tout le
  monde en « Membre » ou « Partenaire » selon le champ réel.
- **Chip « Ancien Bureau »** : réutilise la classe CSS `member-type-chip--visiteur` existante (couleur `info`),
  renommée `--ancien-bureau` — l'ancien concept « Visiteur » n'existe plus, pas de raison de garder ce nom.
- **Filtre Type réel** (demandé explicitement, contredit le choix initial « pas de filtre ») : `TableToolbar`
  (`components/ui/table/TableToolbar.tsx`) gagne `value`/`onChange` optionnels par filtre, rétro-compatible (sans
  `onChange`, un menu reste décoratif — `Trésorerie` n'est pas affecté). `MemberTable` filtre localement
  (Tous/Membre/Bureau/Ancien Bureau/Partenaire) sur la liste déjà chargée, en plus de la recherche texte.
- **CRUD complet, pas seulement lecture** : Modifier/Supprimer réels (`PATCH`/`DELETE /members/:publicId`), « Voir »
  et « Changer le statut » du mock retirés (aucune cible réelle). `RowActions`
  (`components/ui/dropdown/RowActions.tsx`, partagé avec `Trésorerie`) gagne un `onClick`/`danger` optionnel par
  action, rétro-compatible.
- **`app-service` modifié** : en plus de `type`, `ResponseMemberDto`/`MemberHttpMapper.toResponse` exposent
  désormais `createdAt` (existait déjà dans `MemberEntity`/la table, jamais renvoyé par l'API avant). Vérifié :
  aucun test n'affirme la forme exacte de la réponse (`toMatchObject`, pas `toEqual`, dans `tests/e2e/board.e2e-spec.ts`)
  ; ajouts non cassants.
- **Pagination 20/page, sans scroll interne** (demandé explicitement, remplace 8/page) : liste chargée une fois
  (`GET /members?limit=100`), `table-box` sans `table-responsive` (pas de scroll horizontal forcé) — à revoir si une
  colonne venait à déborder sur petit écran.
- **Erreurs métier** : `lib/mappers/member-error.mapper.ts` (calqué sur `office-assignment-error.mapper.ts`) mappe
  `MEMBER_EMAIL_ALREADY_EXISTS`, `MEMBER_HAS_OFFICE_ASSIGNMENTS` (suppression refusée si encore au bureau),
  `MEMBER_NAME_REQUIRED`/`MEMBER_FIRST_NAME_REQUIRED`/`MEMBER_PHONE_NUMBER_INVALID`/`MEMBER_EMAIL_INVALID`.

## Vérifié

`npx tsc --noEmit` (les deux dépôts), `npm run lint`, `npm run test` (15 suites / 54 tests, 0 régression),
`next build --turbopack` (`/member` reste `ƒ` dynamique) : tous verts, à chaque étape (premier passage et
correctifs). **Contre la pile de dev réelle** (`docker`, conteneurs `cie-dev-*`, déjà en route) : `GET /api/members`
confirme `type` renvoyé après redémarrage de `cie-dev-api-1` ; `curl` sur `/member` (via `cie-dev-admin-frontend-1`,
rechargé à chaud, pas de redémarrage nécessaire) confirme le nouveau titre et « Ancien Bureau » dans le HTML rendu.

## Hors périmètre

- Suite de tests dédiée (`__tests__` unitaires pour `member.schema.ts`/`member-error.mapper.ts`) : pas demandée,
  aucun précédent équivalent pour `office-assignment.schema.ts` non plus.
- Historique des mandats/postes d'un membre sur sa propre page (pas de vue détail « Voir » un membre) : non demandé.
- Filtre `type` côté serveur (`GET /members?type=PARTNER`) : le filtrage reste client, sur la page déjà chargée
  (comme la recherche) — pas ajouté à `ListMemberDto`/`ListMemberQuery`, pas nécessaire à cette échelle.
