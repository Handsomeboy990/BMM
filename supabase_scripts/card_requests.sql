-- Demandes de carte de donneur (photo + validation par un administrateur).
--
-- Le parcours actuel (photo, demande, validation, impression / livraison
-- numérique) fonctionne côté client pour la démo. Pour la production, créer
-- cette table et un bucket de stockage pour les photos, puis exposer :
--   - POST   /api/v1/donors/me/card-request        (donneur : photo + format)
--   - GET    /api/v1/card-requests                 (admin : liste)
--   - PATCH  /api/v1/card-requests/{id}            (admin : approve | reject)
--
-- La photo est stockée dans un bucket privé Supabase Storage ; on ne conserve
-- ici que son chemin (photo_path), jamais l'image en base.

CREATE TABLE IF NOT EXISTS card_requests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id      uuid NOT NULL REFERENCES donors (id) ON DELETE CASCADE,
  photo_path    text,
  format        varchar(10) NOT NULL CHECK (format IN ('physical', 'digital')),
  status        varchar(12) NOT NULL DEFAULT 'requested'
                CHECK (status IN ('requested', 'approved', 'rejected')),
  reviewed_by   uuid REFERENCES auth.users (id),
  reviewed_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (donor_id)
);

-- RLS : le donneur gère sa propre demande ; seuls les administrateurs voient
-- l'ensemble et changent le statut.
ALTER TABLE card_requests ENABLE ROW LEVEL SECURITY;
