# 0001 — Page Administration (réglages des sites, sauvegardes)

Statut : appliquée (2026-09-25). API : `app-service`, décision 0011 (modules `site-settings`, `backup`).

## Décisions

- **Route `/administration`**, entrée « Administration » (section « Système ») dans `menuItems.ts`. Trois onglets en liens
  (`?onglet=site|admin|sauvegardes`) : l'onglet est dans l'URL, seul l'onglet ouvert est chargé.
- **Accès** : l'utilisateur saisit le jeton `ADMIN_API_TOKEN` d'app-service ; une Server Action le vérifie
  (`GET /admin-access`) puis le range dans un cookie `httpOnly`, `SameSite=Strict`, `Secure` en production, 8 h.
  L'admin-frontend ne détient aucun secret ; chaque action relit le cookie et l'API revérifie le jeton à chaque appel.
  Jeton refusé par l'API (changé) : cookie effacé, formulaire d'accès réaffiché.
- **Tous les appels partent du serveur Next.js** (Server Components, Server Actions, Route Handler) : le jeton ne passe
  jamais par le JavaScript du navigateur et l'API n'a pas besoin de CORS. Dans Docker, `API_INTERNAL_BASE_URL`
  (`http://api:3000/api`) ; `NEXT_PUBLIC_API_BASE_URL` reste l'URL vue par le navigateur.
- **Actions passées en props** par la page aux composants (`sections/` ne peut pas importer `app/`).
- **Téléchargement** par un Route Handler (`/api/backups/[name]`) qui relaie le flux d'app-service ; **import** par une
  Server Action (fichier ≤ 64 Mo, `serverActions.bodySizeLimit`), contrôlé aussi côté navigateur.
- **Restauration** confirmée par la saisie de « RESTAURER » ; l'API sauvegarde l'état courant juste avant.
- **Modules désactivables** (`hiddenModules`) : retirés du menu par le layout et page « introuvable » (`notFound()`),
  sauf le tableau de bord et l'administration. Bandeau d'annonce pour l'équipe en tête de toutes les pages.
- **Validation d'exécution** écrite à la main dans `lib/schemas/` (réponses API, formulaires) : Zod n'est pas installé.
- Formulaires envoyés par `onSubmit` + `useActionState` (`hooks/use-action-form.ts`) : une `action` de formulaire
  réinitialiserait les champs après un refus de l'API.
