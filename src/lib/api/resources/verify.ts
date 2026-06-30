import { httpClient } from "@/lib/api/http-client";

import type { VerifyResult } from "./types";

export type RewardPayload = {
  bolt11Invoice: string;
  satsAmount?: number;
};

export const verifyApi = {
  /** Statut de vérification publique d'un donneur (ancrage OpenTimestamps). */
  get: (id: string) => httpClient.get<VerifyResult>(`/verify/${id}`),

  /**
   * Récompense Lightning d'un donneur après validation physique d'un don.
   * Réservé aux organisations connectées.
   */
  reward: (id: string, payload: RewardPayload) =>
    httpClient.post<{ message: string; reward: unknown }>(
      `/verify/${id}`,
      payload,
    ),
};
