import {
  createSupabaseServerClient,
  createSupabaseAdminClient,
} from "@/lib/supabase/server";
import { ApiError } from "@/lib/api/errors";
import { CreateDonorDTO, DonorRecord } from "../types";
import type { UpdateDonorDTO } from "../schemas";

export const donorService = {
  /**
   * Enregistre un nouveau donneur dans la base de données Supabase et lui crée un compte Auth
   */
  createDonor: async (
    data: CreateDonorDTO & { otsProof: string | null },
  ): Promise<DonorRecord | null> => {
    const supabase = await createSupabaseServerClient();

    // 1. Inscription dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError || !authData.user) {
      console.error("Auth signUp for donor failed:", authError);
      // Remonte la cause réelle (email déjà utilisé, mot de passe faible,
      // rate limit…) en 400 explicite au lieu d'un 500 générique opaque.
      const message =
        authError?.message || "Erreur lors de la création du compte donneur";
      if (/already registered|already been registered|exists/i.test(message)) {
        throw ApiError.conflict(
          "Un compte existe déjà avec cet email. Connectez-vous ou utilisez une autre adresse.",
        );
      }
      throw ApiError.badRequest(message);
    }

    const userId = authData.user.id;

    // 2. Insertion du profil de donneur relié à la session
    const { data: newDonor, error } = await supabase
      .from("donors")
      .insert([
        {
          id: userId,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone_number: data.phoneNumber,
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
      // On journalise le détail réel (message/code) au lieu d'un objet vide,
      // et on nettoie l'utilisateur auth créé pour éviter les orphelins.
      console.error(
        "Error creating donor profile:",
        error.message,
        error.code,
        error.details,
      );
      const adminClient = createSupabaseAdminClient();
      if (adminClient) {
        await adminClient.auth.admin.deleteUser(userId);
      }
      // 23505 = violation de contrainte d'unicité (email / bitcoin_address /
      // profile_hash déjà présents) → conflit explicite plutôt qu'un 500.
      if (error.code === "23505") {
        throw ApiError.conflict(
          "Un donneur existe déjà avec ces informations (email ou identité Bitcoin).",
        );
      }
      throw ApiError.badRequest(
        `Erreur lors de l'enregistrement du profil de donneur: ${error.message}`,
      );
    }

    return {
      id: newDonor.id,
      firstName: newDonor.first_name,
      lastName: newDonor.last_name,
      email: newDonor.email,
      phoneNumber: newDonor.phone_number,
      bloodType: newDonor.blood_type,
      city: newDonor.city,
      latitude: newDonor.latitude,
      longitude: newDonor.longitude,
      age: newDonor.age,
      available: newDonor.available,
      bitcoinAddress: newDonor.bitcoin_address,
      profileHash: newDonor.profile_hash,
      otsProof: newDonor.ots_proof,
      validated: newDonor.validated,
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
      firstName: donor.first_name,
      lastName: donor.last_name,
      email: donor.email,
      phoneNumber: donor.phone_number,
      bloodType: donor.blood_type,
      city: donor.city,
      latitude: donor.latitude,
      longitude: donor.longitude,
      age: donor.age,
      available: donor.available,
      bitcoinAddress: donor.bitcoin_address,
      profileHash: donor.profile_hash,
      otsProof: donor.ots_proof,
      validated: donor.validated,
      createdAt: new Date(donor.created_at),
    };
  },

  /**
   * Récupère tous les donneurs mobilisables : validés par un centre ET
   * disponibles. Un donneur non validé n'appartient pas encore à la base
   * opérationnelle et ne doit donc jamais remonter dans la recherche/matching.
   */
  getAllAvailableDonors: async (): Promise<DonorRecord[]> => {
    const supabase = await createSupabaseServerClient();

    const { data: donors, error } = await supabase
      .from("donors")
      .select("*")
      .eq("validated", true)
      .eq("available", true)
      .limit(200);

    if (error || !donors) {
      return [];
    }

    return donors.map((donor) => ({
      id: donor.id,
      firstName: donor.first_name,
      lastName: donor.last_name,
      email: donor.email,
      phoneNumber: donor.phone_number,
      bloodType: donor.blood_type,
      city: donor.city,
      latitude: donor.latitude,
      longitude: donor.longitude,
      age: donor.age,
      available: donor.available,
      bitcoinAddress: donor.bitcoin_address,
      profileHash: donor.profile_hash,
      otsProof: donor.ots_proof,
      validated: donor.validated,
      createdAt: new Date(donor.created_at),
    }));
  },

  /**
   * Récupère tous les donneurs validés (donneur ayant déjà effectué au moins un don réel)
   */
  getValidatedDonors: async (): Promise<DonorRecord[]> => {
    const supabase = await createSupabaseServerClient();

    const { data: donors, error } = await supabase
      .from("donors")
      .select("*")
      .eq("validated", true)
      .limit(200);

    if (error || !donors) {
      return [];
    }

    return donors.map((donor) => ({
      id: donor.id,
      firstName: donor.first_name,
      lastName: donor.last_name,
      email: donor.email,
      phoneNumber: donor.phone_number,
      bloodType: donor.blood_type,
      city: donor.city,
      latitude: donor.latitude,
      longitude: donor.longitude,
      age: donor.age,
      available: donor.available,
      bitcoinAddress: donor.bitcoin_address,
      profileHash: donor.profile_hash,
      otsProof: donor.ots_proof,
      validated: donor.validated,
      createdAt: new Date(donor.created_at),
    }));
  },

  /**
   * Valide le profil d'un donneur (effectué par l'administrateur d'un hôpital après un don)
   */
  validateDonor: async (
    id: string,
    otsProof?: string | null,
  ): Promise<DonorRecord | null> => {
    const supabase = await createSupabaseServerClient();

    const updateFields: { validated: boolean; ots_proof?: string | null } = {
      validated: true,
    };
    if (otsProof !== undefined) {
      updateFields.ots_proof = otsProof;
    }

    const { data: donor, error } = await supabase
      .from("donors")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error || !donor) {
      console.error("Error validating donor profile:", error);
      return null;
    }

    return {
      id: donor.id,
      firstName: donor.first_name,
      lastName: donor.last_name,
      email: donor.email,
      phoneNumber: donor.phone_number,
      bloodType: donor.blood_type,
      city: donor.city,
      latitude: donor.latitude,
      longitude: donor.longitude,
      age: donor.age,
      available: donor.available,
      bitcoinAddress: donor.bitcoin_address,
      profileHash: donor.profile_hash,
      otsProof: donor.ots_proof,
      validated: donor.validated,
      createdAt: new Date(donor.created_at),
    };
  },

  /**
   * Met à jour les informations d'un donneur (depuis son espace).
   */
  updateDonor: async (
    id: string,
    data: UpdateDonorDTO,
  ): Promise<DonorRecord | null> => {
    const supabase = await createSupabaseServerClient();

    const patch: Record<string, unknown> = {};
    if (data.phoneNumber !== undefined) patch.phone_number = data.phoneNumber;
    if (data.email !== undefined) patch.email = data.email;
    if (data.city !== undefined) patch.city = data.city;
    if (data.latitude !== undefined) patch.latitude = data.latitude;
    if (data.longitude !== undefined) patch.longitude = data.longitude;
    if (data.available !== undefined) patch.available = data.available;

    const { data: donor, error } = await supabase
      .from("donors")
      .update(patch)
      .eq("id", id)
      .select()
      .single();

    if (error || !donor) {
      console.error("Error updating donor profile:", error);
      throw new Error("Erreur lors de la mise à jour du profil de donneur");
    }

    return {
      id: donor.id,
      firstName: donor.first_name,
      lastName: donor.last_name,
      email: donor.email,
      phoneNumber: donor.phone_number,
      bloodType: donor.blood_type,
      city: donor.city,
      latitude: donor.latitude,
      longitude: donor.longitude,
      age: donor.age,
      available: donor.available,
      bitcoinAddress: donor.bitcoin_address,
      profileHash: donor.profile_hash,
      otsProof: donor.ots_proof,
      validated: donor.validated,
      createdAt: new Date(donor.created_at),
    };
  },
};
