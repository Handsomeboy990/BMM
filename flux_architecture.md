# Flux Complet — Bitcoin Blood

## Vue d'ensemble des acteurs

```
┌─────────────────────────────────────────────────────────────────┐
│                     ACTEURS DE LA PLATEFORME                    │
├──────────────┬──────────────────┬───────────────┬───────────────┤
│   DONNEUR    │    HÔPITAL / ONG │  SUPER ADMIN  │   PUBLIC      │
│  (Citoyen)   │ (Structure santé)│  (Bitcoin     │   (Scanner    │
│              │                  │   Blood)      │    une carte) │
└──────────────┴──────────────────┴───────────────┴───────────────┘
```

---

## Flux 1 — Inscription d'un donneur

```
DONNEUR (App Mobile / Web)
     │
     │  1. Remplit le formulaire (groupe sanguin, ville, age, GPS...)
     │
     ▼
[Frontend Next.js]
     │
     │  2. Génère un wallet Bitcoin côté client (bip322-js)
     │     → Adresse Bitcoin (identifiant unique)
     │     → Signe le hash du profil avec sa clé privée (BIP-322)
     │
     ▼
POST /api/v1/donors
     │
     │  3. Valide les données (Zod)
     │  4. Vérifie la signature BIP-322 (wallet.service.ts)
     │  5. Horodate le profil sur Bitcoin (ots.service.ts → OpenTimestamps)
     │  6. Sauvegarde dans Supabase (donor.service.ts)
     │
     ▼
[Supabase DB] → Table donors
     │
     │  7. Génère la Carte Bitcoin Blood (QR Code avec l'UUID du donneur)
     │
     ▼
DONNEUR reçoit sa carte numérique
```

---

## Flux 2 — Urgence Sanguine (Blood Emergency AI)

```
MÉDECIN (Dashboard Admin Hôpital)
     │
     │  1. Signale une urgence :
     │     - Groupe sanguin recherché (ex: O-)
     │     - Quantité (ex: 2 donneurs)
     │     - Localisation GPS de l'hôpital
     │
     ▼
GET /api/v1/search?bloodType=O-&lat=...&lon=...
     │
     │  2. Récupère tous les donneurs disponibles (Supabase)
     │  3. Filtre par compatibilité ABO/Rhésus
     │  4. Classe par distance (Haversine) ← Blood Emergency AI
     │  5. Renvoie le top 10 des donneurs les plus proches
     │
     ▼
[Dashboard Admin Hôpital]
     │
     │  6. Affiche la liste des donneurs compatibles
     │  7. Envoie des notifications ciblées aux donneurs
     │
     ▼
DONNEURS reçoivent une alerte géolocalisée
```

---

## Flux 3 — Vérification d'une Carte Donneur (Scan QR)

```
HÔPITAL (Scan QR Code de la carte)
     │
     │  1. Scan du QR Code → Extrait l'UUID du donneur
     │
     ▼
GET /api/v1/verify/{uuid}
     │
     │  2. Récupère le profil depuis Supabase
     │  3. Vérifie la preuve OpenTimestamps (Bitcoin)
     │     → La preuve contient le bloc Bitcoin d'horodatage
     │     → Garantit que le profil n'a pas été falsifié
     │
     ▼
Réponse publique :
{
  "bloodType": "O-",
  "bitcoinAddress": "bc1q...",
  "isTimestampVerified": true,
  "details": { "height": 850432, "timestamp": "2026-..." }
}
```

---

## Flux 4 — Authentification & Dashboards (À implémenter)

```
                    ┌─────────────────┐
                    │   SUPABASE AUTH │
                    │  (Email + Magic  │
                    │   Link / OAuth) │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
    ┌─────────▼──────────┐      ┌──────────▼────────────┐
    │   SUPER ADMIN      │      │   ADMIN (Hôpital/ONG) │
    │  role: super_admin │      │   role: org_admin     │
    └─────────┬──────────┘      └──────────┬────────────┘
              │                             │
   ┌──────────▼──────────┐      ┌──────────▼────────────┐
   │ Dashboard Backoffice│      │ Dashboard Opérationnel │
   │                     │      │                        │
   │ • Gérer les orgs    │      │ • Signaler urgences    │
   │ • Valider comptes   │      │ • Voir donneurs        │
   │ • Stats globales    │      │   compatibles          │
   │ • Voir tous les     │      │ • Organiser campagnes  │
   │   donneurs          │      │ • Voir statistiques    │
   │ • Gérer les         │      │   de son organisation  │
   │   campagnes         │      │ • Contacter donneurs   │
   │ • Config plateforme │      │                        │
   └─────────────────────┘      └────────────────────────┘
```

---

## Architecture complète des tables Supabase (Vision finale)

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   donors    │     │  organizations   │     │  emergencies    │
│─────────────│     │──────────────────│     │─────────────────│
│ id (uuid)   │     │ id (uuid)        │     │ id (uuid)       │
│ blood_type  │     │ name             │◄────│ organization_id │
│ city        │     │ type (hospital/  │     │ blood_type      │
│ latitude    │     │   ong/collect)   │     │ quantity_needed │
│ longitude   │     │ latitude         │     │ latitude        │
│ age         │     │ longitude        │     │ longitude       │
│ available   │     │ city             │     │ status          │
│ bitcoin_addr│     │ contact_email    │     │ created_at      │
│ profile_hash│     │ verified         │     └─────────────────┘
│ ots_proof   │     │ created_at       │
│ created_at  │     └──────────────────┘     ┌─────────────────┐
└─────────────┘                               │   campaigns     │
                     ┌──────────────────┐     │─────────────────│
                     │   user_profiles  │     │ id (uuid)       │
                     │──────────────────│     │ organization_id │
                     │ id (uuid)        │     │ title           │
                     │ auth_user_id     │     │ blood_types[]   │
                     │ organization_id  │     │ city            │
                     │ role             │     │ date_start      │
                     │   (super_admin / │     │ date_end        │
                     │    org_admin)    │     │ target_count    │
                     │ created_at       │     │ created_at      │
                     └──────────────────┘     └─────────────────┘
```

---

## Ce qui est déjà fait ✅ vs ce qui reste à faire

| Fonctionnalité                                  | Statut                 |
| ----------------------------------------------- | ---------------------- |
| Table `donors` + API CRUD                       | ✅ Fait                |
| Matching ABO/Haversine (`/api/v1/search`)       | ✅ Fait                |
| Vérification cryptographique (`/api/v1/verify`) | ✅ Fait                |
| Signatures BIP-322 + OTS Bitcoin                | ✅ Fait                |
| **Auth Supabase (Super Admin + Admin)**         | ⏳ À faire             |
| **Tables `organizations`, `user_profiles`**     | ⏳ À faire             |
| **Middleware de protection des routes**         | ⏳ À faire             |
| **API Campagnes**                               | ⏳ À faire             |
| **API Urgences**                                | ⏳ À faire             |
| **Dashboard Super Admin**                       | ⏳ Front (autre agent) |
| **Dashboard Admin Hôpital/ONG**                 | ⏳ Front (autre agent) |
