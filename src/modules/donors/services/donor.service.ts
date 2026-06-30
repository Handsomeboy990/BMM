import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CreateDonorDTO, DonorRecord } from "../types";

export const donorService = {
  /**
   * Enregistre un nouveau donneur dans la base de données Supabase
   */
  createDonor: async (
    data: CreateDonorDTO & { otsProof: string | null },
  ): Promise<DonorRecord | null> => {
    const supabase = await createSupabaseServerClient();

    const { data: newDonor, error } = await supabase
      .from("donors")
      .insert([
        {
          blood_type: data.bloodType,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
          age: data.age,
          available: data.available,
          bitcoin_address: data.bitcoinAddress,
          profile_hash: data.profileHash,
          ots_proof: data.otsProof,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating donor:", error);
      throw new Error("Erreur lors de l'enregistrement du donneur");
    }

    return {
      id: newDonor.id,
      bloodType: newDonor.blood_type,
      city: newDonor.city,
      latitude: newDonor.latitude,
      longitude: newDonor.longitude,
      age: newDonor.age,
      available: newDonor.available,
      bitcoinAddress: newDonor.bitcoin_address,
      profileHash: newDonor.profile_hash,
      otsProof: newDonor.ots_proof,
      createdAt: new Date(newDonor.created_at),
    };
  },

  /**
   * Récupère un donneur par son ID
   */
  getDonorById: async (id: string): Promise<DonorRecord | null> => {
    const supabase = await createSupabaseServerClient();

    const { data: donor, error } = await supabase
      .from("donors")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !donor) {
      return null;
    }

    return {
      id: donor.id,
      bloodType: donor.blood_type,
      city: donor.city,
      latitude: donor.latitude,
      longitude: donor.longitude,
      age: donor.age,
      available: donor.available,
      bitcoinAddress: donor.bitcoin_address,
      profileHash: donor.profile_hash,
      otsProof: donor.ots_proof,
      createdAt: new Date(donor.created_at),
    };
  },

  /**
   * Récupère tous les donneurs disponibles
   */
  getAllAvailableDonors: async (): Promise<DonorRecord[]> => {
    const supabase = await createSupabaseServerClient();

    const { data: donors, error } = await supabase
      .from("donors")
      .select("*")
      .eq("available", true);

    if (error || !donors) {
      return [];
    }

    return donors.map((donor) => ({
      id: donor.id,
      bloodType: donor.blood_type,
      city: donor.city,
      latitude: donor.latitude,
      longitude: donor.longitude,
      age: donor.age,
      available: donor.available,
      bitcoinAddress: donor.bitcoin_address,
      profileHash: donor.profile_hash,
      otsProof: donor.ots_proof,
      createdAt: new Date(donor.created_at),
    }));
  },
};
