# Pièges connus — admin-frontend

- **`github-deploy-key` : clé privée SSH versionnée dans git** (avec sa clé publique, `github-deploy-key.pub`), non ignorée par
  `.gitignore`. Trouvé le 2026-09-21 en construisant l'image Docker (elle n'entre pas dans l'image : `.dockerignore` a `!.env`
  mais ne mentionne pas ces fichiers, et le scan des images de `docker/tests/build/11-…` ne l'y a pas trouvée). **À traiter** :
  révoquer la clé sur GitHub, la retirer de l'historique git, l'ajouter à `.gitignore` et au `.dockerignore`.
- ~~**`src/config/env.ts` lit `process.env[name]`**~~ (corrigé le 2026-09-25 : accès littéral) (accès dynamique, `name` est un paramètre) : Next.js n'inline les variables
  `NEXT_PUBLIC_*` dans le code exécuté par le navigateur que pour un accès **littéral** au moment du build
  (`process.env.NEXT_PUBLIC_API_BASE_URL`). Un accès dynamique risque de rester vide côté navigateur même quand la variable est
  bien fournie au build (l'`ARG`/`ENV` du `Dockerfile` la rend disponible côté serveur, mais pas nécessairement côté client) : à
  vérifier avec un composant client réel avant de s'y fier, sinon récrire l'accès en littéral.
- **Lint sur le vendor** : `public/**` est du code minifié du thème ; sans l'ignore dans `eslint.config.mjs`, `eslint` remonte des milliers d'erreurs.
- **Pages vides** : un `page.tsx` / `layout.tsx` vide fait échouer `next build` (« is not a module »). Toujours exporter au moins un composant.
- **`ui/` ne peut pas importer `hooks/`** (règle d'or) : un hook utilisé par un seul composant `ui/` (ex. compteur de `StatCard2`) reste dans le fichier du composant.
- **Calendrier (`/calendar`) : le vendor ne pilote plus de formulaire/modale** (réécrit le 2026-09-28, décision 0007).
  `apps-calendar.init.js` ne lit plus que `#calendar` — `#form-event`/`#eventDetailsModal`/`#exampleModalToggle`/
  `#calendar-event-*` ont disparu avec `CalendarEventFormModal`/`CalendarEventDetailsModal` (remplacés par de vraies
  modales React, `AddScheduleModal`/`EditScheduleModal`/`DeleteScheduleDialog`/`ScheduleDetailsModal`). Le vendor
  dispatche `cieCalendarDateClicked`/`cieCalendarEventClicked` (`window`, `CustomEvent`) que React écoute pour ouvrir
  ces modales ; il expose aussi `setCieCalendarEvents(events)` que `useCieCalendar` appelle à chaque changement de
  `schedules` (après une Server Action + `revalidatePath("/calendar")`) pour resynchroniser la grille — ne pas
  réintroduire de mutation directe de l'instance FullCalendar (`addEvent`/`existing.setProp`…) côté vendor, ça
  désynchroniserait l'affichage de la vraie source de vérité (l'API). SweetAlert2 n'est plus chargé (la confirmation
  de suppression passe par `DeleteScheduleDialog`, pas `Swal.fire`).
- **Cibles des scripts vanilla** : `#gridjs_sort-table`, `#average-line`, `#average-bar`, `#product-statistics`, `#progress-scroll`, `#lightModeBtn`/`#darkModeBtn`
  sont utilisées par le thème (GridJS, ApexCharts, layout-setup.js). `app/layout.tsx` charge ces scripts une seule fois pour toute l'app.
- **Les données du dashboard (`GraphSuivi`/`Transaction`) ne sont pas dans `mockData.ts`** : les composants React
  (`GraphSuivi.tsx`, `Transaction.tsx`) ne sont que des conteneurs vides ; les séries `ApexCharts` et les lignes
  `gridjs` sont codées en dur dans `public/assets/js/dashboard/e-commerce.init.js` (`renderCharts()`). Vider les
  données mock de ces deux cartes veut dire éditer ce fichier vendor (`data: []`), pas seulement `mockData.ts`
  (décision 0002, 2026-09-26).
- **Menus Bootstrap** : les dropdowns/offcanvas/modals du thème fonctionnent par `data-bs-*` (bundle chargé `afterInteractive`), pas par état React.
  Ne pas ajouter `"use client"` à un composant juste parce qu'il contient un `data-bs-toggle`.
- **`next/image` + classes du thème** : `width`/`height` sont des indications (les classes `avatar-*`, `img-fluid` imposent la taille réelle).
  Tailles des avatars : xs 20, sm 24, md 36, lg 48, xl 72, xxl 84 px.
- **`toLocaleString("fr-FR")`** produit une espace insécable fine (U+202F) : normaliser avant de comparer dans un test.
- **`Footer` / `AboutClub`** affichent `new Date().getFullYear()` dans un Server Component : l'année est figée au build.
- **Jest** : `moduleNameMapper` doit pointer vers `<rootDir>/src/$1` et `__tests__/e2e/` doit être ignoré (specs Playwright) ; `NEXT_PUBLIC_API_BASE_URL`
  est défini dans `jest.setup.ts` car `config/env.ts` lève une erreur à l'import s'il manque.
- **`tsconfig.tsbuildinfo`** est suivi par git et modifié par chaque `tsc`/`build` : ne pas le committer par inadvertance.
- **Module désactivé : HTTP 200, pas 404** : `notFound()` est appelé après le début du streaming (`(admin)/loading.tsx`),
  Next.js ne peut plus changer le statut ; la page affiche « Page introuvable » avec `noindex`. Un vrai 404 demanderait un
  middleware qui lise les réglages à chaque requête.
- **Ne pas avaler les erreurs internes de Next.js** : `apiClient` transforme toute exception de `fetch` en `NETWORK_ERROR`.
  Pendant un pré-rendu statique, un `fetch` `no-store` lève `DYNAMIC_SERVER_USAGE`, qui serait alors masqué : les layouts /
  pages qui appellent l'API doivent être dynamiques (`export const dynamic = "force-dynamic"`, cas de `(admin)/layout.tsx`).
- **Next.js et `role="alert"`** : l'annonceur de route de Next.js est aussi un `role="alert"` (vide) ; dans un test e2e,
  filtrer les alertes par texte.
- **Formulaires et Server Actions** : `<form action={…}>` réinitialise les champs après l'action, même en cas d'erreur ;
  utiliser `hooks/use-action-form.ts` (envoi par `onSubmit`).
- **Import de sauvegarde ≤ 64 Mo** (`serverActions.bodySizeLimit` de `next.config.ts` = `BACKUP_UPLOAD_MAX_BYTES`) ; au-delà,
  Next.js rejette la requête sans message exploitable. `next.config.ts` n'est pas monté dans le conteneur de dev :
  reconstruire l'image après l'avoir modifié.
- **Cookies de session `Secure` en production** : l'admin doit être servi en HTTPS (ou sur `localhost`), sinon le
  navigateur n'enregistre pas les cookies (`cie_access_token`/`cie_refresh_token`) et la connexion semble sans effet.
- **Un Server Component ne peut pas écrire de cookie pendant son rendu** (contrainte Next.js, déjà documentée pour
  l'ancien jeton d'administration) : le rafraîchissement silencieux du jeton d'accès expiré (`POST /auth/refresh`)
  ne peut donc pas avoir lieu dans `(admin)/layout.tsx` — fait dans `src/middleware.ts` (nouveau, décision 0009),
  seul endroit qui tourne avant le rendu et peut poser un cookie sur la réponse.
- **Connexion bureau non vérifiée par clic réel en navigateur** (décision 0009, 2026-10-02) : aucun outil de
  navigateur dans cette session. Vérifié autrement : `tsc`/`lint`/`test`/`next build`, et redirection
  `/dashboard` → `/login` (307) confirmée par `curl` contre la pile réelle. Le cycle de connexion bureau complet
  (`invite → membre → bureau`) a été vérifié côté `app-service` par `curl` direct (décision 0015 de ce dépôt
  voisin), pas via l'UI Next.js elle-même — `POST /auth/register` dépend d'`AUTH_USER_PROFILE_BASE_URL`, vide par
  défaut en dev (`docker/.env.example`). À revérifier par un clic réel dès qu'un outil de navigateur est disponible.
- **Appels à `app-service` sans jeton = listes vides ou « Indisponible »** : les routes de gestion (`/members`,
  `/office-assignments`, `/roles`…) exigent un compte bureau (décision 0015/0017 d'app-service) → 401 sans
  `Authorization`. `lib/api/client.ts` ajoute désormais le jeton de la session (`readAccessToken`) à chaque appel ; un
  en-tête explicite de l'appelant l'emporte. Hors requête Next.js (tests, pré-rendu), aucun en-tête n'est envoyé.
- **Modifier le membre d'une affectation côté API ne resynchronise pas les rôles** (2026-10-03) : `PATCH
  /office-assignments/:publicId` accepte `memberId`, mais `UpdateOfficeAssignmentUseCase` ne rejoue pas la
  synchronisation de `user_roleTable` (la suppression, elle, la fait). Résultat : l'ancien membre garde `bureau`
  sans affectation, le nouveau n'est pas promu. L'interface évite le cas (membre fixe). À corriger côté
  `app-service` ou à interdire dans son validateur.
