import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CreateCampaignDTO, CampaignRecord } from "../types";
import { donorService, DonorRecord } from "@/modules/donors";

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Rayon de la terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const campaignService = {
  /**
   * Trouve les donneurs ciblés pour une campagne
   */
  findTargetedDonors: async (
    type: "targeted" | "general",
    targetBloodType: string | undefined,
    lat: number,
    lon: number,
    radiusKm: number,
  ): Promise<DonorRecord[]> => {
    // 1. Récupérer tous les donneurs
    const allDonors = await donorService.getAllAvailableDonors();

    // 2. Filtrer par distance
    let targetedDonors = allDonors.filter((donor) => {
      const distance = haversineDistance(
        lat,
        lon,
        donor.latitude,
        donor.longitude,
      );
      return distance <= radiusKm;
    });

    // 3. Filtrer par groupe sanguin si campagne ciblée
    if (type === "targeted" && targetBloodType) {
      targetedDonors = targetedDonors.filter(
        (d) => d.bloodType === targetBloodType,
      );
    }

    return targetedDonors;
  },

  /**
   * Simule l'envoi d'emails aux donneurs ciblés
   */
  simulateEmailSending: (donors: DonorRecord[], campaignTitle: string) => {
    /* eslint-disable no-console */
    console.log(
      `[SIMULATION EMAIL] Début de l'envoi pour la campagne "${campaignTitle}"`,
    );
    console.log(`[SIMULATION EMAIL] Cible : ${donors.length} donneur(s).`);

    // Dans un vrai projet, on utiliserait Resend, SendGrid, etc.
    donors.forEach((d) => {
      console.log(
        `- Email envoyé au donneur ID: ${d.id} (Groupe: ${d.bloodType})`,
      );
    });

    console.log(`[SIMULATION EMAIL] Fin de l'envoi.`);
    /* eslint-enable no-console */
    return donors.length; // Retourne le nombre d'emails envoyés
  },

  /**
   * Crée une campagne dans la base de données
   */
  createCampaign: async (
    data: CreateCampaignDTO,
  ): Promise<CampaignRecord | null> => {
    // Étape 1 : Trouver les donneurs ciblés
    const targetedDonors = await campaignService.findTargetedDonors(
      data.type,
      data.targetBloodType,
      data.latitude,
      data.longitude,
      data.radiusKm,
    );

    // Étape 2 : Envoyer les emails (simulation)
    const emailsSentCount = campaignService.simulateEmailSending(
      targetedDonors,
      data.title,
    );

    // Étape 3 : Sauvegarder la campagne avec les stats
    const supabase = await createSupabaseServerClient();

    const { data: newCampaign, error } = await supabase
      .from("campaigns")
      .insert([
        {
          hospital_id: data.hospitalId,
          title: data.title,
          type: data.type,
          target_blood_type: data.targetBloodType || null,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
          radius_km: data.radiusKm,
          emails_sent: emailsSentCount,
          responses_count: 0, // Commence à 0
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating campaign:", error);
      throw new Error("Erreur lors de la création de la campagne");
    }

    return {
      id: newCampaign.id,
      hospitalId: newCampaign.hospital_id,
      title: newCampaign.title,
      type: newCampaign.type,
      targetBloodType: newCampaign.target_blood_type,
      city: newCampaign.city,
      latitude: newCampaign.latitude,
      longitude: newCampaign.longitude,
      radiusKm: newCampaign.radius_km,
      emailsSent: newCampaign.emails_sent,
      responsesCount: newCampaign.responses_count,
      status: newCampaign.status,
      createdAt: new Date(newCampaign.created_at),
    };
  },

  /**
   * Récupère toutes les campagnes d'un hôpital pour son dashboard
   */
  getHospitalCampaigns: async (
    hospitalId: string,
  ): Promise<CampaignRecord[]> => {
    const supabase = await createSupabaseServerClient();

    const { data: campaigns, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("hospital_id", hospitalId)
      .order("created_at", { ascending: false });

    if (error || !campaigns) {
      return [];
    }

    return campaigns.map((c) => ({
      id: c.id,
      hospitalId: c.hospital_id,
      title: c.title,
      type: c.type,
      targetBloodType: c.target_blood_type,
      city: c.city,
      latitude: c.latitude,
      longitude: c.longitude,
      radiusKm: c.radius_km,
      emailsSent: c.emails_sent,
      responsesCount: c.responses_count,
      status: c.status,
      createdAt: new Date(c.created_at),
    }));
  },
};
