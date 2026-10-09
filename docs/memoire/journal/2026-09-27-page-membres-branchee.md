# 2026-09-27 — Page « Membres » branchée sur l'API réelle

Demande : « connect la page member au backend ».

- Constat de départ : le mock `Member` (`type` Membre/Bureau/Partenaire/Visiteur, `status` Actif/Inactif, `avatarUrl`)
  ne correspond à aucun champ réel de `MemberTable` — vérifié dans `schema.prisma`. Question posée à l'utilisateur ;
  premier passage : « Bureau » dérivé des affectations actives, Statut/Partenaire/Visiteur masqués.
- Retour utilisateur après test sur la pile de dev réelle (capture d'écran de `/member`) : pagination 20 sans
  scroll, titre « Liste des membres et partenaires », filtre Type à remettre (Membre/Bureau/Partenaire), et le seul
  membre de la base (lui-même, affecté au bureau) apparaissait « Membre » au lieu de « Bureau ».
- Vérification (`curl` direct sur `app-service`) : pas un bug — son mandat de bureau s'est terminé le 31/08/2026,
  or on est le 27/09/2026. Deux questions posées : (1) comment traiter un mandat expiré → réponse : créer un
  nouveau type « Ancien Bureau » plutôt que de le confondre avec « Membre » ou d'ignorer les dates ; (2) comment
  rendre « Partenaire » réel → réponse : ajouter un vrai champ `type` à `Member` (migration `app-service`).
- Champ `type` ajouté à `MemberTable` (`schema.prisma` + toute la chaîne hexagonale), schéma poussé sur la base de
  dev réelle en redémarrant `cie-dev-api-1` (le conteneur exécute `prisma db push` à chaque démarrage). `type`
  affiché combine désormais le champ réel (Membre/Partenaire) et les affectations (Bureau/Ancien Bureau/rien).
- Détail dans la décision [0005](../decisions/0005-page-membres-branchee.md) (mise à jour avec l'état final).
