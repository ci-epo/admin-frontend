---
description: Stratégie de tests Next.js — types autorisés vs interdits (Jest, RTL, Playwright)
globs: "**/*.{spec,test}.{ts,tsx}"
alwaysApply: true
---

# Stratégie de tests

Source : audit adapté au frontend (fonctions pures / hooks / composants / intégration réseau / e2e).
Outillage en place : **Jest + jsdom + React Testing Library** (`npm run test`), **Playwright** (`npm run test:e2e`, dossier `__tests__/e2e`).
On teste **ce que voit l'utilisateur** (rôles, textes), jamais les détails d'implémentation.

## Autorisé (créer / garder)

| Type | Emplacement | Contenu attendu |
|------|-------------|-----------------|
| Unitaire fonction pure (prio 1) | `__tests__/units/lib/**/*.spec.ts` | mappers, schémas, utils, `apiClient` (`fetch` mocké) : règles + codes d'erreur |
| Unitaire schéma / validation | `__tests__/units/lib/schemas/*.schema.spec.ts` | cas valides, invalides, limites |
| Unitaire hook | `__tests__/units/hooks/use-*.spec.ts(x)` | `renderHook` : transitions d'état, valeurs dérivées |
| Composant avec **logique / interaction** | `__tests__/units/components/**/*.spec.tsx` | pagination, filtres, formulaires, états chargement/erreur/vide/succès, via `userEvent` |
| Intégration section + réseau (prio 1) | `__tests__/integrations/**/*.spec.tsx` | section complète, réseau simulé avec **MSW** (à installer), succès **et** erreurs API |
| Pont vanilla (wrapper) | `__tests__/units/components/**/App*.spec.tsx` | init au montage, `destroy` au démontage, réaction à l'événement `cie…Changed` — scripts vendor **mockés** |
| E2E Playwright (prio 2) | `__tests__/e2e/*.spec.ts` | parcours critiques : connexion, navigation `menuItems`, liste + pagination, ajout/édition |
| Accessibilité (optionnel) | dans les tests e2e ou composant | contrôle `axe` sur pages clés |

Règle de placement : toute logique métier doit être **extraite dans `lib/` ou `hooks/`** pour être testable ; c'est là que va la majorité des tests.

## Interdit (ne jamais créer ; supprimer s'ils existent)

- Test unitaire d'un **Server Component asynchrone** (`page.tsx` qui `await`) : difficile à monter en jsdom → extraire la logique en fonction pure, couvrir la page par e2e
- Test d'un composant **purement présentationnel** qui ne fait que relire ses props (`Button`, `Badge`, `Avatar`, `StatCard`… : `toHaveClass("btn-primary")`)
- **Snapshots** de balisage (le thème Bootstrap porté produit du HTML volumineux et instable)
- Tests du code **vendor** de `public/assets/` (ApexCharts, GridJS, FullCalendar, Simplebar, `app.js`) — on ne teste que notre wrapper React
- Test qui vérifie un détail d'implémentation (`useState` appelé, nom de classe CSS, ordre des `<div>`) au lieu du comportement visible
- Test qui mocke `fetch` ou `apiClient` **à l'intérieur** d'un test de composant : mocker le réseau (MSW) ou passer les données en props
- e2e « Hello World » / test qui recharge simplement la page d'accueil sans scénario
- Test dépendant de `mockData.ts` pour valider une règle : construire la donnée **dans le test**
- Tout test qui ne fait que relire un mock (`expect(fn).toHaveBeenCalled()`) sans comportement observable

```typescript
// ❌ BAD — composant présentationnel, relit ses props
it("applique la classe", () => {
  render(<Button variant="primary">OK</Button>);
  expect(screen.getByRole("button")).toHaveClass("btn-primary");
});

// ✅ GOOD — logique pure : apiClient normalise les erreurs (lib/api/client.ts)
it("mappe un 404 en NOT_FOUND", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 404,
    headers: new Headers({ "content-type": "application/json" }),
    json: async () => ({ message: "Membre introuvable" }),
  });

  await expect(apiClient({ path: "/members/x", method: "GET" })).rejects.toMatchObject({
    code: "NOT_FOUND",
    status: 404,
  });
});
```

## Convention

- `describe("NomExact")`, `it` au présent ; requêtes RTL par rôle/texte, `userEvent` plutôt que `fireEvent`
- Alias `@/…` dans les tests, comme dans le code
- Une seule assertion de comportement par `it` (plusieurs `expect` autorisés si même comportement)
- e2e : un fichier par parcours, données de test isolées, pas de dépendance à l'ordre d'exécution

## Prérequis de configuration (à respecter avant d'écrire les premiers tests)

- `jest.config.ts` : `moduleNameMapper` doit mapper `@/` vers `<rootDir>/src/$1` (et non `<rootDir>/$1`)
- `jest.config.ts` : exclure `__tests__/e2e/` (`testPathIgnorePatterns`) sinon Jest exécute aussi les specs Playwright
- `.env` de test : `NEXT_PUBLIC_API_BASE_URL` défini (sinon `config/env.ts` lève une erreur à l'import)

## Comportement agent

- Nouveau test hors tableau « Autorisé » → **ne pas écrire**, proposer intégration (MSW) / e2e si besoin.
- Test de composant présentationnel, snapshot ou test de Server Component async trouvé → **supprimer** (remplacer par un test de fonction pure, d'intégration ou e2e si besoin).
- Ne pas supprimer / ne pas refuser un test d'intégration (`__tests__/integrations/**`) ni un e2e Playwright (`__tests__/e2e/**`).
- Logique métier dans un composant rendant le test impossible → **extraire** vers `lib/` ou `hooks/` avant de tester.
