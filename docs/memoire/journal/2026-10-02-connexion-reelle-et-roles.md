# 2026-10-02 — Connexion réelle (bureau), menu filtré par permission

Demandé par l'utilisateur, en miroir de la décision 0015 d'`app-service` (système de rôles bureau/membre/invité).
Détail complet : décision 0009.

- `(auth)/login` : vrai formulaire (e-mail/mot de passe) → `POST /auth/login` + `GET /auth/me`, refuse tout
  compte qui n'a pas le rôle `bureau`.
- Session = cookies `cie_access_token`/`cie_refresh_token` (`lib/auth/session.ts`), rafraîchis silencieusement
  par un nouveau `src/middleware.ts` (un Server Component ne peut pas écrire de cookie pendant son rendu).
- `(admin)/layout.tsx` protège désormais **toutes** les routes (avant : seule `/administration` l'était) et
  filtre le menu par permission en plus des modules désactivés (`withoutUnauthorizedModules`). `/treasury` et
  `/administration` revérifient leur permission individuellement (défense en profondeur).
- `ADMIN_API_TOKEN`, `admin-session.ts`, `AdminAccessForm` supprimés ; « Verrouiller » remplacé par une vraie
  déconnexion (`logoutAction`, révoque la session côté API).
- Vérifié : `tsc`/`lint`/`test` (58 passés)/`next build` verts ; contre la pile réelle, `/dashboard` sans session
  redirige bien vers `/login` (307). Cycle de connexion bureau complet vérifié côté `app-service` par `curl`
  (décision 0015 de ce dépôt voisin), pas par clic réel en navigateur (aucun outil de navigateur disponible, et
  `/auth/register` dépend d'une variable vide par défaut en dev).

## 2026-10-03 — `userId` nullable (décision 0017 d'app-service)

`/auth/me` renvoie `userId: null` pour un compte sans poste (aucun profil). Le schéma de réponse l'accepte désormais,
pour qu'un invité reçoive le message « accès réservé au bureau » et non une erreur de format. Tests verts (58).

## 2026-10-03 — Appels API authentifiés (tableau de bord vide)

Le tableau de bord affichait « Total membres : Indisponible » et « Aucune affectation » : `app-service` exige désormais un
compte bureau sur `/members` et `/office-assignments`, et `apiClient` n'envoyait aucun jeton. Corrigé dans
`lib/api/client.ts` (jeton de la session ajouté à chaque appel). Tests : 60 passés. Vérifié par `curl` : anonyme → 401,
jeton du bureau → 200 avec l'affectation `CR-EXT`. Reste à reconstruire `cie-admin-frontend-1` pour voir le correctif.

## 2026-10-03 — Mot de passe facultatif à la création d'un membre (priorité 2 du bilan)

`AddMemberModal` gagne un champ « Mot de passe (facultatif) ». Renseigné, il est envoyé à `POST /members` : app-service crée
alors membre et compte ensemble. Règle identique à l'API (8 caractères, lettre, chiffre, symbole), validée avant envoi.
La modification (`parseUpdateMemberForm`) n'envoie jamais de mot de passe. Vérifié par l'API : création 201, connexion du
nouveau compte 200, doublon refusé. Tests : 66 passés.
