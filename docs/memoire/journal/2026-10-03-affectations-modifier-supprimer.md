# 2026-10-03 — Affectations du bureau : modifier et supprimer

Priorité 4 du bilan (partie affectations). Ajout d'un menu par ligne du tableau « Comptes Admin » du dashboard :
modification (poste, mandat, dates ; membre fixe) et suppression avec confirmation.

- Fichiers : `EditOfficeAssignmentModal`, `DeleteOfficeAssignmentDialog`, `OfficeAssignmentRowActions` (nouveaux),
  `AccountRow`/`Account`/`page.tsx` (branchement), `dashboard.actions.ts`, `office-assignment.endpoints.ts`,
  `office-assignment.schema.ts` (`parseUpdateOfficeAssignmentForm`), `office-assignment.loader.ts` (ids et dates
  bruts dans la ligne).
- Choix : le membre n'est pas modifiable (pas de resynchronisation des rôles côté API, cf. PIEGES).
- Vérifié : `tsc`, `lint`, `jest` (69 tests, dont 3 nouveaux), API réelle (PATCH/DELETE, erreurs 400/404).
- Non fait : modification de transaction (décision Trésorerie maintenue, à confirmer par l'utilisateur).

## Archives (priorité 3)

- `/archiver` : faux documents mock remplacés par un état vide (pas de module archive côté API). Composants et
  mock devenus inutilisés, non supprimés (à faire avec la conception du module).
- `/about` : laissé tel quel, contenu à relire (licence, version).

## Administration : onglet Rôles et permissions (priorité 5)

- Nouvel onglet `droits` sur `/administration` : matrice rôle/poste ↔ permissions, enregistrement par différences.
- Le menu « Administration » disparaît pour un compte sans `page:administration` (comportement voulu, cf. ETAT).

## Rôle admin et Projets (dernières priorités)

- Accès : `bureau` et `admin` acceptés par admin-frontend. Page Administration réservée au rôle `admin`.
- Page Projets branchée (liste, ajout, modification, suppression), entrée de menu ajoutée. Technologie non saisie (cf. ETAT).

## Tags de projet

- Interface tags : cases à cocher sur le formulaire projet (diff `syncProjectTags`), badges, section Tags (CRUD).
- `computePermissionChanges` généralisé en `computeLinkChanges` (`lib/utils/link-selection.ts`), réutilisé par les tags.
- Côté API : FK `project-tags` corrigées (public_id, cascade) et existence vérifiée à la création de liaison.
