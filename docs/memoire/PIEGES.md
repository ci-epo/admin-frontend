# Pièges connus — admin-frontend

- **Lint sur le vendor** : `public/**` est du code minifié du thème ; sans l'ignore dans `eslint.config.mjs`, `eslint` remonte des milliers d'erreurs.
- **Pages vides** : un `page.tsx` / `layout.tsx` vide fait échouer `next build` (« is not a module »). Toujours exporter au moins un composant.
- **`ui/` ne peut pas importer `hooks/`** (règle d'or) : un hook utilisé par un seul composant `ui/` (ex. compteur de `StatCard2`) reste dans le fichier du composant.
- **IDs DOM du calendrier** (`#calendar`, `#form-event`, `#eventDetailsModal`, `#calendar-event-*`…) sont lus par `public/assets/js/app/apps-calendar.init.js` : ne pas les renommer.
- **Cibles des scripts vanilla** : `#gridjs_sort-table`, `#average-line`, `#average-bar`, `#product-statistics`, `#progress-scroll`, `#lightModeBtn`/`#darkModeBtn`
  sont utilisées par le thème (GridJS, ApexCharts, layout-setup.js). `app/layout.tsx` charge ces scripts une seule fois pour toute l'app.
- **Menus Bootstrap** : les dropdowns/offcanvas/modals du thème fonctionnent par `data-bs-*` (bundle chargé `afterInteractive`), pas par état React.
  Ne pas ajouter `"use client"` à un composant juste parce qu'il contient un `data-bs-toggle`.
- **`next/image` + classes du thème** : `width`/`height` sont des indications (les classes `avatar-*`, `img-fluid` imposent la taille réelle).
  Tailles des avatars : xs 20, sm 24, md 36, lg 48, xl 72, xxl 84 px.
- **`toLocaleString("fr-FR")`** produit une espace insécable fine (U+202F) : normaliser avant de comparer dans un test.
- **`Footer` / `AboutClub`** affichent `new Date().getFullYear()` dans un Server Component : l'année est figée au build.
- **Jest** : `moduleNameMapper` doit pointer vers `<rootDir>/src/$1` et `__tests__/e2e/` doit être ignoré (specs Playwright) ; `NEXT_PUBLIC_API_BASE_URL`
  est défini dans `jest.setup.ts` car `config/env.ts` lève une erreur à l'import s'il manque.
- **`tsconfig.tsbuildinfo`** est suivi par git et modifié par chaque `tsc`/`build` : ne pas le committer par inadvertance.
