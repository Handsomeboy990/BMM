# Endpoints backend à implémenter

Le frontend est entièrement câblé. Certaines fonctionnalités tournent
aujourd'hui sur des **données simulées** (mode démo `NEXT_PUBLIC_AUTH_BYPASS`)
faute d'endpoint. Voici ce qui manque côté backend pour passer du mock au réel.

Conventions : préfixe `/api/v1`, enveloppe `{ data, meta }` / `{ error }`,
validation Zod, authentification par session Supabase.

## 1. Espace donneur

Aujourd'hui, `authService.getCurrentUser()` ne lit que `user_profiles`
(structures) : une session donneur renvoie `null`. Les donneurs ont pourtant
un compte Supabase (créé à l'inscription).

| Méthode | Route                          | Rôle                  | Description                                                                            |
| ------- | ------------------------------ | --------------------- | -------------------------------------------------------------------------------------- |
| GET     | `/api/v1/donors/me`            | donneur               | Profil du donneur connecté (étendre `getCurrentUser` pour résoudre la table `donors`). |
| PATCH   | `/api/v1/donors/:id`           | donneur (soi)         | Mise à jour : téléphone, email, ville, lat/lon, disponibilité, type de don préféré.    |
| GET     | `/api/v1/donors/:id/rewards`   | donneur (soi) / admin | Historique des récompenses Lightning du donneur.                                       |
| GET     | `/api/v1/donors/:id/donations` | donneur (soi) / admin | Historique des dons (centre, composant, volume, date, statut).                         |

**Champs `donors` à ajouter** (schéma) : `phenotype`, `rarity`,
`cmv_negative`, `preferred_donation`, éligibilité (`eligible_at` /
`deferred_reason`).

## 2. Organisations (console super-admin)

| Méthode | Route                              | Rôle        | Description                        |
| ------- | ---------------------------------- | ----------- | ---------------------------------- |
| GET     | `/api/v1/organizations`            | super_admin | Liste de toutes les organisations. |
| PATCH   | `/api/v1/organizations/:id/verify` | super_admin | Vérifie (valide) une organisation. |

## 3. Réseau inter-centres (stock & transferts)

| Méthode | Route                           | Rôle      | Description                                                           |
| ------- | ------------------------------- | --------- | --------------------------------------------------------------------- |
| GET     | `/api/v1/stock`                 | org_admin | Stock de la structure par composant et groupe.                        |
| PATCH   | `/api/v1/stock/:id`             | org_admin | Ajuste un niveau de stock.                                            |
| GET     | `/api/v1/transfers`             | org_admin | Demandes de transfert du réseau (entrantes + sortantes).              |
| POST    | `/api/v1/transfers`             | org_admin | Publie une demande (composant, groupe, quantité, urgence).            |
| POST    | `/api/v1/transfers/:id/respond` | org_admin | Un centre s'engage à fournir la demande.                              |
| PATCH   | `/api/v1/transfers/:id`         | org_admin | Statut : `ouverte` → `acceptée` → `en_transit` → `reçue` / `annulée`. |

**Schéma à ajouter** :

- `stock(id, hospital_id, component['CGR'|'Plasma'|'Plaquettes'], blood_type,
units, expiring_soon, updated_at)`
- `transfer_requests(id, component, blood_type, quantity, urgency,
requester_id, responder_id, status, created_at)`

> Piste : ancrer les transferts validés sur Bitcoin (OpenTimestamps) pour la
> traçabilité poche → receveur, dans la continuité de l'existant.

## Côté frontend (où câbler)

Tous les points d'intégration sont isolés dans `src/lib/api/` :

- `src/lib/api/resources/*` : ajouter les fonctions HTTP (réutiliser
  `httpClient`).
- `src/lib/api/hooks.ts` : chaque hook a déjà une branche `AUTH_BYPASS`
  (mock) ; il suffira de remplacer l'appel mock par l'appel réel.
- Désactiver le mode démo : `NEXT_PUBLIC_AUTH_BYPASS=false`.
