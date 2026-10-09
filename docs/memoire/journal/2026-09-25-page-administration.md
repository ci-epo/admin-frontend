# 2026-09-25 — Page Administration

## Fait
- `app/(admin)/administration/` : `page.tsx`, `administration.actions.ts` (8 Server Actions), `admin-session.ts` (cookie).
- `app/api/backups/[name]/route.ts` (téléchargement). `components/sections/admin/administration/` (15 composants),
  `components/ui/form/switch/Switch.tsx` (interrupteur non contrôlé, envoyé avec le formulaire).
- `lib/api/administration.endpoints.ts`, `administration.loader.ts` ; `lib/schemas/`, `lib/mappers/` ; `lib/utils/`
  (`admin-modules`, `format-bytes`, `format-date`) ; `hooks/use-action-form.ts` ; types `administration`, `backup`,
  `site-settings`.
- `(admin)/layout.tsx` : dynamique, menu filtré (modules désactivés), bandeau d'annonce. Pages des modules : `notFound()`.
- `config/env.ts` : accès littéral à `process.env.NEXT_PUBLIC_API_BASE_URL` (piège précédent corrigé), `apiBaseUrl()`.
- `lib/api/client.ts` : URL construite par concaténation (`new URL("/x", ".../api")` perdait `/api`), code métier
  `apiCode`, `apiRawClient` (corps binaire, réponse en flux), 413/503 reconnus.

## Vérifié
- `tsc`, `eslint` (frontières de couches), `jest` : 14 suites / 48 tests, `next build`.
- Parcours Playwright (Chrome) sur la pile de dev : mauvais jeton, déverrouillage, erreur de champ (saisie conservée),
  réglages des deux sites, module désactivé retiré du menu, sauvegarde, téléchargement (`PGDMP`), restauration confirmée,
  import (valide et invalide), suppression, verrouillage, téléchargement sans session → 401. Aucune erreur JS.
