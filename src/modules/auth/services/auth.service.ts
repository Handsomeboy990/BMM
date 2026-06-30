import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LoginDTO, SignUpDTO, UserProfile } from "../types";

export const authService = {
  /**
   * Connecte un utilisateur existant
   */
  login: async (data: LoginDTO) => {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      console.error("Login failed:", error);
      throw new Error(error.message || "Erreur de connexion");
    }

    return authData;
  },

  /**
   * Déconnecte l'utilisateur courant et nettoie sa session
   */
  logout: async () => {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error);
      throw new Error("Erreur de déconnexion");
    }
  },

  /**
   * Inscrit une nouvelle organisation et lui associe un administrateur
   */
  signUpOrganization: async (data: SignUpDTO) => {
    const supabase = await createSupabaseServerClient();

    // 1. Inscription dans Supabase Auth (crée le compte)
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (signUpError || !authData.user) {
      console.error("Auth signUp failed:", signUpError);
      throw new Error(
        signUpError?.message || "Erreur lors de la création du compte",
      );
    }

    const userId = authData.user.id;

    try {
      // 2. Création de l'organisation dans la base
      const { data: newOrg, error: orgError } = await supabase
        .from("organizations")
        .insert([
          {
            name: data.name,
            type: data.type,
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city,
            contact_email: data.contactEmail,
            verified: false, // Non vérifié par défaut
          },
        ])
        .select()
        .single();

      if (orgError || !newOrg) {
        console.error("Org insertion failed:", orgError);
        throw new Error("Erreur lors de la création de l'organisation");
      }

      // 3. Création du profil utilisateur lié à l'organisation
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: userId,
            organization_id: newOrg.id,
            role: "org_admin",
          },
        ]);

      if (profileError) {
        console.error("Profile insertion failed:", profileError);
        // Nettoyage de l'organisation créée
        await supabase.from("organizations").delete().eq("id", newOrg.id);
        throw new Error("Erreur lors de la création du profil utilisateur");
      }

      return {
        user: authData.user,
        organization: newOrg,
      };
    } catch (err) {
      console.error("Database initialization failed during signup:", err);
      throw err;
    }
  },

  /**
   * Récupère les informations et le profil de l'utilisateur connecté
   */
  getCurrentUser: async (): Promise<UserProfile | null> => {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Récupère le rôle et l'organisation associée
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*, organization:organizations(*)")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    const org = profile.organization;

    return {
      id: user.id,
      email: user.email,
      role: profile.role as "super_admin" | "org_admin",
      organizationId: profile.organization_id,
      organization: org
        ? {
            id: org.id,
            name: org.name,
            type: org.type,
            latitude: org.latitude,
            longitude: org.longitude,
            city: org.city,
            contactEmail: org.contact_email,
            verified: org.verified,
            createdAt: new Date(org.created_at),
          }
        : null,
    };
  },
};
