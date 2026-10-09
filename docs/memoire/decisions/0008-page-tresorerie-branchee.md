# 0008 — Page « Trésorerie » branchée sur l'API réelle (création/suppression de transaction)

Statut : appliquée (2026-09-28). API : `app-service` (`accounts`, `categories`, `operators`, `transactions`) +
`app-service` modifié (décision 0014 de ce dépôt : `Transaction` gagne un `amount`, FK `publicId` corrigées,
`AccountTable.balance` tenu à jour à la création/suppression d'une transaction).

## Contexte

Le mock (`TreasuryTransaction` : `nom`/`role`/`contact`/`objectif`/`montant`/`soldeApres`) ne correspond pas au
domaine réel exposé par `app-service` : pas de champ « Rôle », `Transaction` n'avait ni montant ni FK utilisables
(cf. décision 0014, `app-service`), et il n'existe qu'une seule identité de contrepartie (`Operator` : nom +
téléphone + whatsapp), pas de mix téléphone/e-mail comme le mock.

## Décisions

- **Colonnes réelles** : Date, Type (déduit de `category.type`, pas stocké sur la transaction), Nom/Contact
  (`Operator.name`/`phoneNumber`), Objectif (`Transaction.description`), Montant (signé, `+`/`-` selon le type de
  catégorie), Caisse (solde du compte + nom du compte). **« Rôle » retiré** (aucun champ réel, même logique que
  `Member` décision 0005) ; **« Reçu »** (action du mock) retirée aussi, aucune donnée de justificatif n'existe.
- **`Operator` (la contrepartie de l'opération) est créé à la volée, sans écran de gestion dédié** : le formulaire
  « Nouvelle opération » crée d'abord l'opérateur (`POST /operators`, nom + téléphone — `whatsapp` rempli avec la
  même valeur, pas de champ séparé) puis la transaction, dans la même Server Action
  (`createTransactionAction`, `app/(admin)/treasury/treasury.actions.ts`). Si la création de la transaction échoue
  après celle de l'opérateur, ce dernier reste orphelin (compromis accepté, pas de rollback multi-appels).
- **`Account`/`Category` sont de la vraie donnée de référence, sans écran de gestion dédié non plus** : choisies
  dans un `<select>` du formulaire, alimentées par les seeders `accounts`/`categories` ajoutés côté `app-service`
  (décision 0014). Pas de bouton « + Nouvelle caisse »/« + Nouvelle catégorie » : hors périmètre, pas dans la
  maquette.
- **Transaction non modifiable dans l'UI** (seulement créée/supprimée) : une écriture comptable se corrige par une
  nouvelle écriture, pas en éditant l'historique — évite aussi toute réconciliation de solde côté frontend sur une
  opération d'édition qui ne serait pas garantie par `app-service` (cf. décision 0014, `UpdateTransactionUseCase`
  ne réconcilie pas `balance`). `RowActions` (partagé avec `Membres`/`Comptes Admin`) propose seulement « Détails »
  (modale de lecture, affiche aussi les champs absents du tableau : moyen de paiement, whatsapp) et « Supprimer ».
- **« Caisse » = solde courant recalculé côté frontend** (`lib/api/treasury.loader.ts`) : `AccountTable.balance`
  (tenu à jour par `app-service`) est la seule source de vérité ; le loader répartit ce solde chronologiquement sur
  les transactions du compte (tri par date croissante, solde d'ouverture = solde actuel moins la somme des deltas)
  pour obtenir un solde après chaque ligne, comme dans la maquette — recalcul pur, aucune donnée inventée.
- **Cartes stats réelles** : « Montant actuel » = somme des soldes de tous les comptes ; « Entrées »/« Dépenses »
  = somme des montants du mois courant par type de catégorie, comparée au mois précédent (`captionHighlight` = %
  de variation, vide si le mois précédent est à 0 — pas de division par zéro).
- **Recherche et filtre Type réels** (nom opérateur/objectif/catégorie/caisse ; Entrées/Dépenses/Toutes), même
  patron que `Membres` (décision 0005). **Filtre « Période » laissé décoratif** (pas demandé, cohérent avec le
  reste de l'app où tous les filtres ne sont pas branchés en même temps).

## Vérifié

`npx tsc --noEmit`, `npm run lint` (0 erreur/warning), `npm run test` (15 suites / 55 tests, 0 régression),
`next build --turbopack` (`/treasury` reste `ƒ` dynamique). **Contre la pile de dev réelle** (conteneurs `cie-*`,
déjà en route) : `docker restart cie-api-1` (schéma poussé) puis `docker exec cie-api-1 npm run seed` (seeders
`accounts`/`categories`) ; créé deux transactions de test par `curl` (une entrée, une dépense) → `GET /treasury`
(HTML rendu par `cie-admin-frontend-1`, rechargé à chaud) confirme les noms d'opérateurs, l'objectif, les montants
signés (`+25 000 FCFA`/`-8 500 FCFA`) et le solde par ligne recalculé (`-8 500` puis `16 500`, cohérent avec l'ordre
chronologique et le solde final du compte) ; transactions et opérateurs de test supprimés ensuite, solde du compte
revenu à 0.

## Hors périmètre

- Écran de gestion des caisses/catégories/opérateurs : aucun, pas dans la maquette (cf. « Décisions » ci-dessus).
- Modification d'une transaction : non exposée (décision assumée, cf. ci-dessus).
- Filtre « Période » : décoratif.
- Page/UI Budget : aucune, `app-service` garde son bug de FK sur `Budget.account_id` (décision 0014).
