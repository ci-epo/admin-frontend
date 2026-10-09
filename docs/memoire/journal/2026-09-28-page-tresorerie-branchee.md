# 2026-09-28 — Page Trésorerie branchée

Détail complet : décision 0008. Résumé :

- `/treasury` branché sur `app-service` (`accounts`/`categories`/`operators`/`transactions`). `app-service`
  modifié (décision 0014 de ce dépôt) : `Transaction` gagne `amount`, ses FK référencent enfin `public_id`
  (créer une transaction via l'API était impossible avant), `AccountTable.balance` est tenu à jour automatiquement.
- Créer/supprimer une opération via de vraies Server Actions ; opérateur (contrepartie) créé à la volée, pas de
  modification de transaction (décision assumée). Caisses/catégories seedées côté `app-service`, pas d'écran de
  gestion dédié côté `admin-frontend`.
- « Caisse » (solde par ligne) recalculée côté frontend à partir du solde réel du compte, en répartissant
  chronologiquement les deltas des transactions — pas de donnée inventée.
- Vérifié contre la pile de dev réelle : transactions de test créées/supprimées par l'API, page rechargée à chaud
  confirme montants et soldes corrects.
