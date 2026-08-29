import { createSupabaseServerClient } from "@/lib/supabase/server";

export type BloodAvailability = {
  bloodType: string;
  /** Unités disponibles sur l'ensemble du réseau, tous composants confondus. */
  units: number;
  /** Part du niveau cible, entre 0 et 100. */
  level: number;
  status: "critique" | "faible" | "stable";
};

export type PublicStatistics = {
  donorsRegistered: number;
  organizations: number;
  citiesCovered: number;
  activeCampaigns: number;
  activeEmergencies: number;
  donationsRecorded: number;
  availability: BloodAvailability[];
  /** Villes réellement couvertes, pour le bandeau des régions. */
  cities: string[];
};

export const BLOOD_TYPES_ORDER = [
  "O-",
  "O+",
  "A-",
  "A+",
  "B-",
  "B+",
  "AB-",
  "AB+",
] as const;

/**
 * Niveau cible par groupe: on ne peut pas exprimer un pourcentage de réserve
 * sans référence. Faute d'objectif national déclaré, on rapporte le stock au
 * plus fort stock observé, ce qui donne une lecture relative honnête.
 */
function toAvailability(unitsByType: Map<string, number>): BloodAvailability[] {
  const max = Math.max(1, ...unitsByType.values());

  return BLOOD_TYPES_ORDER.map((bloodType) => {
    const units = unitsByType.get(bloodType) ?? 0;
    const level = Math.round((units / max) * 100);
    const status = level < 25 ? "critique" : level < 55 ? "faible" : "stable";
    return { bloodType, units, level, status };
  });
}

export const statisticsService = {
  /**
   * Chiffres publics de la plateforme. Aucune donnée nominative n'en sort:
   * uniquement des agrégats destinés à la page d'accueil.
   */
  getPublicStatistics: async (): Promise<PublicStatistics> => {
    const supabase = await createSupabaseServerClient();

    const [donors, organizations, campaigns, emergencies, stock, activities] =
      await Promise.all([
        supabase
          .from("donors")
          .select("city", { count: "exact" })
          .eq("validated", true),
        supabase.from("organizations").select("city", { count: "exact" }),
        supabase
          .from("campaigns")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("emergencies")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        supabase.from("stock").select("blood_type, units"),
        supabase
          .from("donor_activities")
          .select("id", { count: "exact", head: true })
          .eq("activity_type", "blood_donation"),
      ]);

    const unitsByType = new Map<string, number>();
    for (const row of (stock.data ?? []) as {
      blood_type: string;
      units: number;
    }[]) {
      unitsByType.set(
        row.blood_type,
        (unitsByType.get(row.blood_type) ?? 0) + row.units,
      );
    }

    const cities = new Set<string>();
    for (const row of (donors.data ?? []) as { city: string | null }[]) {
      if (row.city) cities.add(row.city);
    }
    for (const row of (organizations.data ?? []) as { city: string | null }[]) {
      if (row.city) cities.add(row.city);
    }

    return {
      donorsRegistered: donors.count ?? 0,
      organizations: organizations.count ?? 0,
      citiesCovered: cities.size,
      activeCampaigns: campaigns.count ?? 0,
      activeEmergencies: emergencies.count ?? 0,
      donationsRecorded: activities.count ?? 0,
      availability: toAvailability(unitsByType),
      cities: [...cities].sort((a, b) => a.localeCompare(b, "fr")),
    };
  },
};
