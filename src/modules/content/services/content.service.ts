import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SiteContent = {
  key: string;
  title: string;
  /** Markdown restreint, rendu par `src/lib/markdown.ts`. */
  body: string;
  updatedAt: string;
};

type ContentRow = {
  key: string;
  title: string;
  body: string;
  updated_at: string;
};

function mapContent(row: ContentRow): SiteContent {
  return {
    key: row.key,
    title: row.title,
    body: row.body,
    updatedAt: row.updated_at,
  };
}

export const contentService = {
  /**
   * Contenu publié pour une clé, ou `null` s'il n'a jamais été rédigé.
   *
   * Ne lève pas: une page légale doit s'afficher même si la base est
   * indisponible. L'appelant retombe alors sur le texte livré avec
   * l'application.
   */
  get: async (key: string): Promise<SiteContent | null> => {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("site_content")
        .select("key, title, body, updated_at")
        .eq("key", key)
        .maybeSingle();

      if (error || !data) return null;
      return mapContent(data as ContentRow);
    } catch {
      return null;
    }
  },

  /** Tous les contenus rédigés, pour la console d'administration. */
  list: async (): Promise<SiteContent[]> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("key, title, body, updated_at")
      .order("key");

    if (error) {
      throw new Error(`Contenus indisponibles: ${error.message}`);
    }
    return ((data ?? []) as ContentRow[]).map(mapContent);
  },

  /** Crée ou remplace un contenu. Réservé au super-administrateur. */
  save: async (input: {
    key: string;
    title: string;
    body: string;
    updatedBy: string;
  }): Promise<SiteContent> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_content")
      .upsert(
        {
          key: input.key,
          title: input.title,
          body: input.body,
          updated_at: new Date().toISOString(),
          updated_by: input.updatedBy,
        },
        { onConflict: "key" },
      )
      .select("key, title, body, updated_at")
      .single();

    if (error || !data) {
      throw new Error(
        error?.message ?? "Enregistrement du contenu impossible.",
      );
    }
    return mapContent(data as ContentRow);
  },
};
