import { httpClient } from "@/lib/api/http-client";

export type DonationPurpose =
  | "campaign"
  | "development"
  | "operations"
  | "emergency";

export const DONATION_PURPOSE_LABELS: Record<DonationPurpose, string> = {
  campaign: "Campagne de don",
  development: "Developpement de la plateforme",
  operations: "Fonctionnement",
  emergency: "Fonds d'urgence",
};

export const DONATION_PURPOSE_HINTS: Record<DonationPurpose, string> = {
  campaign: "Financer les campagnes et alertes de don de sang.",
  development: "Soutenir le developpement et les evolutions du produit.",
  operations: "Couvrir les couts d'hebergement et de fonctionnement.",
  emergency: "Alimenter le fonds reserve aux urgences vitales.",
};

export type CreateDonationPayload = {
  amountSats: number;
  purpose: DonationPurpose;
  message?: string;
};

export type DonationInvoice = {
  bolt11: string;
  amountSats: number;
  purpose: DonationPurpose;
  feesSat: number;
  simulated: boolean;
};

export const donationsApi = {
  /** Genere une facture Lightning pour un don a la plateforme. */
  create: (payload: CreateDonationPayload) =>
    httpClient.post<DonationInvoice>("/donations", payload),
};
