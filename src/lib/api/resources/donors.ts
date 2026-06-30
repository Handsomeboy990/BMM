import { httpClient } from "@/lib/api/http-client";

import type { BloodType, DonorRecord } from "./types";

/**
 * Inscription d'un donneur. Les champs cryptographiques (adresse Bitcoin,
 * profileHash SHA-256 et signature BIP-322) sont produits côté client par
 * `@/lib/bitcoin/donor-identity` avant l'envoi.
 */
export type CreateDonorPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  bloodType: BloodType;
  city: string;
  latitude: number;
  longitude: number;
  age: number;
  available: boolean;
  bitcoinAddress: string;
  profileHash: string;
  signature: string;
};

export const donorsApi = {
  create: (payload: CreateDonorPayload) =>
    httpClient.post<DonorRecord>("/donors", payload),

  // TODO(backend): brancher dès que `GET /api/v1/donors` (liste annuaire)
  // est disponible. Pour l'instant l'annuaire s'appuie sur des données
  // simulées via le hook `useDonors`.
};
