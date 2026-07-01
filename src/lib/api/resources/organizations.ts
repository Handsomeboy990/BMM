import { httpClient } from "@/lib/api/http-client";

import type { Organization } from "./types";

export const organizationsApi = {
  /** Liste toutes les organisations (super-admin). */
  list: () => httpClient.get<Organization[]>("/organizations"),

  /** Vérifie une organisation (super-admin). */
  verify: (id: string) =>
    httpClient.patch<Organization>(`/organizations/${id}/verify`),
};
