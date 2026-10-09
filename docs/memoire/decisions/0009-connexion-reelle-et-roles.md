# 0009 — Connexion réelle (bureau) et menu filtré par permission, suppression du jeton d'administration

Statut : appliquée (2026-10-02). API : `app-service`, décision 0015 (système de rôles bureau/membre/invité).

## Contexte

Décision 0001 : l'accès à `/administration` était protégé par un jeton statique partagé (`ADMIN_API_TOKEN`),
saisi une fois et gardé en cookie — aucune autre route de `(admin)` n'était protégée, et `(auth)/login` était un
placeholder inerte (`docs/memoire/ETAT.md` : « seule la page Administration est protégée »). `app-service`
implémente désormais un vrai système de comptes/rôles où **seul le bureau** accède à `admin-frontend` (décision
0015, confirmée explicitement avec l'utilisateur) ; `membre`/`invité` n'ont accès qu'au site public.

## Décisions

- **Connexion réelle** (`(auth)/login`) : formulaire e-mail/mot de passe (`LoginForm`, Server Action
  `loginAction`) → `POST /auth/login` d'app-service, puis `GET /auth/me` pour vérifier `role === "bureau"`
  avant de poser la session — un compte `membre`/`invité` valide est refusé avec un message explicite, pas
  seulement redirigé plus tard.
- **Session = deux cookies httpOnly** (`lib/auth/session.ts`, remplace `administration/admin-session.ts`) :
  jeton d'accès (courte durée) et jeton de rafraîchissement (longue durée) d'app-service, `maxAge` calculé à
  partir de `accessExpiresAt`/`refreshExpiresAt` renvoyés par l'API (pas de constante dupliquée côté frontend).
- **`src/middleware.ts` (nouveau)** : rafraîchit silencieusement le jeton d'accès (`POST /auth/refresh`) quand
  son cookie a expiré mais que le jeton de rafraîchissement est encore valide — un Server Component ne peut pas
  écrire de cookie pendant son rendu (contrainte Next.js), donc ce rafraîchissement ne peut pas avoir lieu dans
  `(admin)/layout.tsx`.
- **`(admin)/layout.tsx` protège toutes les routes** : `getCurrentAccess()` (`GET /auth/me`) ; redirige vers
  `/login` si aucune session ou si `role !== "bureau"`. Le menu est filtré par `hiddenModules` (inchangé, décision
  0001) **et** par les permissions de l'utilisateur (`withoutUnauthorizedModules`, nouveau, même patron que
  `withoutHiddenModules`) : `menuItems.ts` gagne un champ `permission` optionnel (`page:treasury` sur Trésorerie,
  `page:administration` sur Administration — tout le reste reste accessible à n'importe quel compte bureau).
- **`/treasury` et `/administration` revérifient leur permission** (`notFound()`, même traitement qu'un module
  désactivé) : défense en profondeur, un lien direct ne contourne pas le filtre de menu.
- **`/administration` perd son propre écran de déverrouillage** (`AdminAccessForm` supprimé) : la page est
  protégée une fois pour toutes par la permission `page:administration`, plus de jeton à ressaisir ; le bouton
  « Verrouiller » disparaît (remplacé par « Se déconnecter » dans le menu profil, câblé à une vraie Server
  Action `logoutAction` qui révoque la session côté API).
- **`ADMIN_API_TOKEN` entièrement retiré** : `checkAdminToken`/`/admin-access` (route supprimée côté
  `app-service`), `isAdminTokenRejected` → `isSessionRejected` (codes `AUTH_TOKEN_REQUIRED`/`AUTH_TOKEN_INVALID`
  au lieu de `ADMIN_TOKEN_*`/`ADMIN_API_DISABLED`, qui n'existent plus côté API).
- **En-tête** : `CURRENT_USER` (mock, `mockData.ts`) supprimé — l'e-mail réel vient de `/auth/me`. Avatar
  toujours une image par défaut (aucune donnée d'avatar côté API, hors périmètre — cf. `ETAT.md`).

## Vérifié

`npx tsc --noEmit`, `npm run lint` (0 erreur), `npm run test` (58 passés, dont les nouveaux
`withoutUnauthorizedModules` et `isSessionRejected`), `next build` (toutes les routes compilent, middleware
inclus). Contre la pile de dev réelle (`cie-admin-frontend-1`, déjà en route) : `/login` affiche le vrai
formulaire ; `GET /dashboard` sans session répond `307` vers `/login` (middleware + layout fonctionnels). **Pas
vérifié par clic réel en navigateur** : aucun outil de navigateur dans cette session, et `POST /auth/register`
d'app-service dépend d'`AUTH_USER_PROFILE_BASE_URL` (vide par défaut en dev, cf. `docker/.env.example`) — le
cycle de connexion bureau complet a été vérifié côté `app-service` par `curl` (décision 0015), pas via l'UI
Next.js elle-même.

## Hors périmètre

- Restrictions `invité` sur le site public (`web-frontend`) : non traitées, à préciser plus tard (confirmé avec
  l'utilisateur).
- Mapping par défaut des permissions par poste (`app-service`, `043-position-permissions.seeder.ts`) : à valider
  avec le club.
- Avatar réel par utilisateur : toujours l'image par défaut du thème (`ETAT.md`, point déjà ouvert).
