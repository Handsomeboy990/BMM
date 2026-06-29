import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";

/**
 * Client Supabase pour les Composants Client (navigateur).
 * Utilise uniquement la clé anonyme publique.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
