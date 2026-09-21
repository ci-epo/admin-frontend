---
description: Regles de codage global.
alwaysApply: true
---

# 1. Longueur et taille du code (NextJS)

- Composant	: 100 à 150 lignes maximum, une seule responsabilité
- Fichier `page.tsx` le plus léger possible : il assemble, il ne contient pas la logique
- Props d'un composant : 5 à 7 maximum (au-delà, regrouper ou revoir le découpage)
- Hook personnalisé : Une seule préoccupation, nom en useXxx
- JSX imbriqué : Extraire en sous-composants au-delà de 3 ou 4 niveaux
- Si un composant mélange récupération de données, logique métier et affichage, il faut le découper.

# 2. Server Components vs Client Components

C'est la règle la plus spécifique à Next.js.

- Server Component par défaut. N'ajouter "use client" que si le composant a besoin d'état (useState), d'effets (useEffect), d'événements (onClick) ou d'API navigateur.
- Pousser "use client" le plus bas possible dans l'arbre : un petit bouton interactif doit être client, pas toute la page.
- Passer des Server Components en children d'un Client Component quand c'est utile, pour ne pas alourdir le bundle.
- Ne jamais importer de code serveur (accès base de données, secrets) dans un composant client. Le package server-only permet de bloquer cette erreur à la compilation.

# 3. Récupération et gestion des données

- Récupérer les données côté serveur (Server Components) dès que possible, plutôt qu'avec useEffect + fetch côté client.
- Choisir consciemment la stratégie de cache et de rendu (statique, dynamique, revalidation) pour chaque page, et vérifier les comportements par défaut de votre version de Next.js, qui ont changé d'une version à l'autre.
- Éviter les cascades de requêtes (waterfalls) : lancer les requêtes indépendantes en parallèle avec Promise.all.
- Utiliser des Server Actions ou des Route Handlers pour les mutations, avec validation côté serveur.
- Côté client, pour les données qui changent souvent, utiliser une bibliothèque dédiée (TanStack Query, SWR) plutôt que des useEffect maison.
-Centraliser les appels API dans une couche dédiée (lib/api), pas dans les composants.

# 4. État et hooks

- Limiter l'état global : commencer par l'état local, puis remonter l'état seulement si nécessaire.
- L'URL est un état : filtres, pagination, onglets vont dans les paramètres de recherche (partageable, compatible avec le bouton retour).
- Ne pas dupliquer l'état dérivé : calculer une valeur à partir des props ou de l'état plutôt que de la stocker dans un second useState.
useEffect en dernier recours : ce n'est pas pour transformer des données ni réagir à un clic. Beaucoup d'effets sont inutiles.
- Extraire la logique dans des hooks personnalisés pour garder les composants lisibles.
- Respecter les règles des hooks (le plugin ESLint react-hooks les vérifie automatiquement).
- Ne pas abuser de useMemo / useCallback : mesurer avant d'optimiser (et vérifier si votre version bénéficie du React Compiler).

# 5. TypeScript

- Mode strict activé, sans exception.
- Interdire any (règle ESLint) : utiliser unknown puis affiner.
- Typer les props explicitement, et les données de l'API.
- Valider les données externes à l'exécution avec Zod ou équivalent : les types TypeScript disparaissent à l'exécution et ne protègent pas contre une réponse API inattendue.
- Partager les schémas entre validation de formulaire et Server Actions.
- Types discriminés ({ status: "loading" } | { status: "success", data }) plutôt que plusieurs booléens.

# 6. Performance

- next/image pour toutes les images (dimensions, lazy loading, formats modernes).
- next/font pour les polices (pas de décalage de mise en page).
- next/link pour la navigation interne.
- Imports dynamiques (next/dynamic) pour les composants lourds ou rarement affichés.
- Surveiller la taille du bundle (@next/bundle-analyzer) et éviter les grosses dépendances pour une petite fonction.
- Suspense et loading.tsx pour le rendu progressif (streaming).
- Suivre les Core Web Vitals (LCP, CLS, INP) avec Lighthouse et des mesures en production.

# 7. Gestion des erreurs et états d'interface

- Fichiers error.tsx, not-found.tsx et loading.tsx par segment de route.
- Toujours prévoir 4 états : chargement, erreur, vide, succès.
- Error Boundaries autour des zones à risque.
- Ne pas exposer les détails techniques de l'erreur à l'utilisateur, mais les journaliser (Sentry ou équivalent).

# 8. Accessibilité et SEO

- HTML sémantique (button, nav, main, h1...) plutôt que des div cliquables.
- Labels sur les champs, texte alternatif sur les images, contraste suffisant, navigation au clavier.
- Plugin eslint-plugin-jsx-a11y (inclus dans la config Next.js) et tests avec axe.
- API metadata / generateMetadata pour les titres, descriptions et Open Graph.

# 9. Sécurité

- Variables d'environnement : seules celles préfixées NEXT_PUBLIC_ sont envoyées au navigateur. Ne jamais y mettre de secret.
- Valider et autoriser côté serveur dans chaque Server Action et Route Handler : ce sont des points d'entrée publics, comme n'importe quelle API.
- Vérifier l'authentification près des données (au moment de l'accès), pas seulement dans le middleware ou l'interface.
- Éviter dangerouslySetInnerHTML, ou assainir le contenu (DOMPurify).
- En-têtes de sécurité (CSP, etc.) dans la configuration.
- Ne pas renvoyer au client plus de données que nécessaire depuis un Server Component (on ne passe pas un objet utilisateur complet avec des champs sensibles).

# 10. Styles

- Une approche unique et cohérente : Tailwind CSS, CSS Modules ou une bibliothèque de composants, mais pas un mélange anarchique.
- Composants d'interface réutilisables (design system léger) plutôt que des classes recopiées.
- Tokens de design (couleurs, espacements) centralisés.
- Approche mobile-first et responsive dès le départ.

# 11. Tests

- Tests unitaires et de composants : Vitest ou Jest avec React Testing Library. On teste ce que voit l'utilisateur (rôles, textes), pas les détails d'implémentation.
- Tests de bout en bout : Playwright ou Cypress pour les parcours critiques (connexion, paiement).
- Mock des appels réseau avec MSW.
- Tests d'accessibilité automatisés (axe).
- Note : les Server Components asynchrones sont difficiles à tester en unitaire, donc les couvrir surtout avec des tests de bout en bout et déporter la logique métier dans des fonctions pures testables.

# 12. Outillage et automatisation

- ESLint avec eslint-config-next et Prettier pour le formatage.
tsc --noEmit dans la CI.
- Husky + lint-staged pour vérifier avant chaque commit.
- Alertes sur les dépendances (Dependabot, Renovate).
- Aperçus de déploiement par pull request (Vercel ou équivalent).
- Monitoring en production (erreurs, performances).