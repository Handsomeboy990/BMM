import { createSupabaseServerClient } from "@/lib/supabase/server";

export type OrganizationRecord = {
  id: string;
  name: string;
  type: "hospital" | "ong" | "collect";
  latitude: number;
  longitude: number;
  city: string;
  contactEmail: string;
  verified: boolean;
  createdAt: Date;
};

type OrgRow = {
  id: string;
  name: string;
  type: OrganizationRecord["type"];
  latitude: number;
  longitude: number;
  city: string;
  contact_email: string;
  verified: boolean;
  created_at: string;
};

function mapOrg(row: OrgRow): OrganizationRecord {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    latitude: row.latitude,
    longitude: row.longitude,
    city: row.city,
    contactEmail: row.contact_email,
    verified: row.verified,
    createdAt: new Date(row.created_at),
  };
}

export const organizationService = {
  /** Liste toutes les organisations (réservé au super-admin). */
  getAllOrganizations: async (): Promise<OrganizationRecord[]> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return (data as OrgRow[]).map(mapOrg);
  },

  /** Marque une organisation comme vérifiée. */
  verifyOrganization: async (
    id: string,
  ): Promise<OrganizationRecord | null> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("organizations")
      .update({ verified: true })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      console.error("Error verifying organization:", error);
      throw new Error("Erreur lors de la vérification de l'organisation");
    }
    return mapOrg(data as OrgRow);
  },
};
