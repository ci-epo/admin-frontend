---
description: Architecture hexagonale NestJS — couches, dépendances, checklist module
alwaysApply: true
---

# Architecture hexagonale (NestJS)

Source : `referentiel-architecture-hexagonale-nestjs.pdf`

## Règle d'or

Les dépendances pointent **vers l'intérieur** :

- `domain/` ne connaît personne (pas NestJS, pas ORM, pas HTTP)
- `application/` ne connaît que `domain/`
- `adapter/` + `infrastructure/` connaissent le framework, la DB et le HTTP
- Coller ensemble ce qui change ensemble (composant, style, test).
- Alias d'imports (@/features/...) au lieu de ../../../.
- Pas d'imports circulaires entre features : une feature ne dépend pas des détails internes d'une autre.
- Exports explicites (un index.ts par feature qui expose seulement l'API publique).

## Couches sous `src/`

| Couche | Rôle | Contient |
|--------|------|----------|
| `domain/` | Cœur métier | entities, enums, errors, port/in\|out\|tokens, service/validators, service/policies |
| `application/` | Orchestration | use_case, dto, mapper, errors |
| `adapter/` | Branchements | in/<module> (controller+module), in/http (filtres), out/persistence |
| `infrastructure/` | Technique | config, database/<orm> |

## Règles métier par emplacement

- **entities/** : props privées, getters lecture seule ; `update()` renvoie une nouvelle instance
- **errors/** : le domaine parle en **codes**, jamais en statuts HTTP
- **port/in/** : un fichier par action (create, get, list, update, delete) + Command
- **port/out/** : décrit ce dont le métier a besoin, jamais comment
- **validators/** : validation métier des commandes ; lève `BusinessError`
- **policies/** : règles inter-entités ; reçoivent des entités déjà chargées, **pas d'I/O**
- **use_case/** : validate → construire/charger → policies → repository
- **dto/** : validation syntaxique (class-validator), distincte de la validation métier
- **mapper/** : DTO ↔ Command ↔ Entity ↔ ligne ORM ; l'entité **ne fuit jamais** telle quelle
- **controller** : mince — mapper → use case → mapper, zéro logique métier
- **repository** : persistance seule ; multi-écritures = use case (+ port transaction si besoin)

## Interdits

- Pas de `HttpException` dans les contrôleurs / use cases : codes domaine/app → filtre global
- Injection via **token** `UPPER_SNAKE_CASE`, jamais via classe concrète d'adaptateur
- Secrets jamais commités en clair dans `config/`

## Checklist nouveau module

1. entity → 2. enums → 3. port/out → 4. port/in (1 action = 1 fichier)
5. validators → 6. policies (si besoin) → 7. dto → 8. mappers
9. use_case → 10. repository adapter → 11. controller + module Nest → 12. tests
