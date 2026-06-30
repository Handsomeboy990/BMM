-- =========================================================================
-- Bitcoin Blood — Script Global d'Initialisation de la Base de Données
-- À exécuter dans l'éditeur SQL de votre Dashboard Supabase
-- =========================================================================

-- 1. Nettoyage de l'ancienne structure (dans l'ordre inverse des dépendances)
DROP TABLE IF EXISTS emergencies CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS donors CASCADE;

DROP TYPE IF EXISTS campaign_type CASCADE;
DROP TYPE IF EXISTS organization_type CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- 2. Création des Énumérations
CREATE TYPE organization_type AS ENUM ('hospital', 'ong', 'collect');
CREATE TYPE user_role AS ENUM ('super_admin', 'org_admin');
CREATE TYPE campaign_type AS ENUM ('targeted', 'general');


-- =========================================================================
-- 3. Création des Tables
-- =========================================================================

-- Table des Donneurs (donors)
CREATE TABLE donors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blood_type      VARCHAR(3) NOT NULL CHECK (
    blood_type IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')
  ),
  city            VARCHAR(255) NOT NULL,
  latitude        DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude       DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  age             INTEGER NOT NULL CHECK (age BETWEEN 18 AND 120),
  available       BOOLEAN NOT NULL DEFAULT TRUE,
  bitcoin_address VARCHAR(255) NOT NULL UNIQUE,
  profile_hash    CHAR(64) NOT NULL UNIQUE,
  ots_proof       TEXT,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Table des Organisations (organizations)
CREATE TABLE organizations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  type          organization_type NOT NULL,
  latitude      DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude     DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  city          VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  verified      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Table des Profils Utilisateurs (user_profiles)
CREATE TABLE user_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  role            user_role NOT NULL DEFAULT 'org_admin',
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Table des Campagnes de don (campaigns)
CREATE TABLE campaigns (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id       UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title             VARCHAR(255) NOT NULL,
  type              campaign_type NOT NULL,
  target_blood_type VARCHAR(3) CHECK (
    target_blood_type IS NULL OR
    target_blood_type IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')
  ),
  city              VARCHAR(255) NOT NULL,
  latitude          DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude         DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  radius_km         INTEGER NOT NULL DEFAULT 20 CHECK (radius_km BETWEEN 1 AND 500),
  emails_sent       INTEGER NOT NULL DEFAULT 0,
  responses_count   INTEGER NOT NULL DEFAULT 0,
  status            VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Table des Urgences Sanguines (emergencies)
CREATE TABLE emergencies (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id       UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  blood_type        VARCHAR(3) NOT NULL CHECK (
    blood_type IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')
  ),
  quantity_needed   INTEGER NOT NULL DEFAULT 1 CHECK (quantity_needed >= 1),
  city              VARCHAR(255) NOT NULL,
  latitude          DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude         DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  status            VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);


-- =========================================================================
-- 4. Indexation
-- =========================================================================

CREATE INDEX idx_donors_blood_type ON donors (blood_type);
CREATE INDEX idx_donors_available  ON donors (available);

CREATE INDEX idx_campaigns_hospital   ON campaigns (hospital_id);
CREATE INDEX idx_campaigns_created_at ON campaigns (created_at DESC);

CREATE INDEX idx_emergencies_hospital   ON emergencies (hospital_id);
CREATE INDEX idx_emergencies_status     ON emergencies (status);
CREATE INDEX idx_emergencies_created_at ON emergencies (created_at DESC);


-- =========================================================================
-- 5. Sécurité : Activation RLS
-- =========================================================================

ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;


-- =========================================================================
-- 6. Politiques RLS (Row Level Security)
-- =========================================================================

-- Table: donors
CREATE POLICY "Tout le monde peut s'inscrire comme donneur"
  ON donors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Tout le monde peut lire les profils de donneurs"
  ON donors FOR SELECT
  USING (true);

-- Table: organizations
CREATE POLICY "Lecture publique des organisations vérifiées"
  ON organizations FOR SELECT
  USING (verified = true OR (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'super_admin');

CREATE POLICY "Super admin gère les organisations"
  ON organizations FOR ALL
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'super_admin');

-- Table: user_profiles
CREATE POLICY "Les admins peuvent voir leur propre profil"
  ON user_profiles FOR SELECT
  USING (id = auth.uid() OR (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'super_admin');

CREATE POLICY "Super admin gère tous les profils"
  ON user_profiles FOR ALL
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'super_admin');

-- Table: campaigns
CREATE POLICY "Super admin gère toutes les campagnes"
  ON campaigns FOR ALL
  USING (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'super_admin'
  );

CREATE POLICY "Org admin voit les campagnes de son hôpital"
  ON campaigns FOR SELECT
  USING (
    hospital_id = (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Org admin peut créer des campagnes"
  ON campaigns FOR INSERT
  WITH CHECK (
    hospital_id = (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
  );

-- Table: emergencies
CREATE POLICY "Super admin gère toutes les urgences"
  ON emergencies FOR ALL
  USING (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'super_admin'
  );

CREATE POLICY "Org admin voit les urgences de son hôpital"
  ON emergencies FOR SELECT
  USING (
    hospital_id = (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Org admin peut créer des urgences"
  ON emergencies FOR INSERT
  WITH CHECK (
    hospital_id = (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Org admin peut modifier ses propres urgences"
  ON emergencies FOR UPDATE
  USING (
    hospital_id = (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
  );
