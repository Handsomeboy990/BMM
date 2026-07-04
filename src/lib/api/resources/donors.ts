import { httpClient } from "@/lib/api/http-client";

import type { BloodType, DonorRecord, RewardLog } from "./types";

/** Champs qu'un donneur peut mettre à jour depuis son espace. */
export type UpdateDonorPayload = Partial<{
  phoneNumber: string;
  email: string;
  city: string;
  latitude: number;
  longitude: number;
  available: boolean;
}>;

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

  /** Donneurs validés (≥ 1 don confirmé). Réservé aux structures connectées. */
  list: () => httpClient.get<DonorRecord[]>("/donors"),

  /** Valide un donneur après confirmation d'un don physique. */
  validate: (id: string) =>
    httpClient.patch<{ message: string; donor: DonorRecord }>(
      `/donors/${id}/validate`,
    ),

  /** Profil du donneur connecté. */
  me: () => httpClient.get<DonorRecord>("/donors/me"),

  /** Met à jour le profil du donneur. */
  update: (id: string, payload: UpdateDonorPayload) =>
    httpClient.patch<DonorRecord>(`/donors/${id}`, payload),

  /** Historique des récompenses Lightning d'un donneur. */
  rewards: (id: string) => httpClient.get<RewardLog[]>(`/donors/${id}/rewards`),

  /** Attestation d'identité sanguine signée (BIP-322), vérifiable hors-ligne. */
  offlineIdentity: (id: string) =>
    httpClient.get<{ message: string; identity: OfflineIdentityResponse }>(
      `/donors/${id}/offline-identity`,
    ),
};

export type OfflineIdentityResponse = {
  payload: {
    donorId: string;
    bloodType: string;
    timestamp: string;
    issuer: string;
  };
  profileHash: string;
  clinicAddress: string;
  signature: string;
};
