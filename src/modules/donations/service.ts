import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { CreateDonationDTO } from "./schemas";

/**
 * Journalise une intention de don a la plateforme. Best-effort: si la table
 * n'existe pas encore ou que le service-role est absent, on ne bloque pas la
 * generation de la facture Lightning.
 */
export const donationService = {
  logDonation: async (
    data: CreateDonationDTO & { bolt11: string; simulated: boolean },
  ): Promise<void> => {
    const admin = createSupabaseAdminClient();
    if (!admin) return;

    const { error } = await admin.from("platform_donations").insert([
      {
        amount_sats: data.amountSats,
        purpose: data.purpose,
        message: data.message ?? null,
        bolt11: data.bolt11,
        status: data.simulated ? "simulated" : "pending",
      },
    ]);

    if (error) {
      console.warn(
        "[Donations] Journalisation ignoree (table absente ?):",
        error.message,
      );
    }
  },
};
