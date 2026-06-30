"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  authApi,
  campaignsApi,
  donorsApi,
  emergenciesApi,
  searchApi,
  verifyApi,
  type CreateCampaignPayload,
  type CreateDonorPayload,
  type CreateEmergencyPayload,
  type EmergencyStatus,
  type LoginPayload,
  type RegisterOrganizationPayload,
  type RewardPayload,
  type SearchParams,
} from "./resources";

export const queryKeys = {
  me: ["auth", "me"] as const,
  emergencies: (hospitalId?: string) =>
    ["emergencies", hospitalId ?? "all"] as const,
  emergency: (id: string) => ["emergencies", "detail", id] as const,
  campaigns: (hospitalId?: string) =>
    ["campaigns", hospitalId ?? "mine"] as const,
  verify: (id: string) => ["verify", id] as const,
};

/* ----------------------------- Session ----------------------------- */

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => authApi.me().then((r) => r.data),
    retry: false,
    staleTime: 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.me }),
  });
}

export function useRegisterOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterOrganizationPayload) =>
      authApi.register(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.me }),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => qc.clear(),
  });
}

/* ---------------------------- Urgences ----------------------------- */

export function useEmergencies(hospitalId?: string) {
  return useQuery({
    queryKey: queryKeys.emergencies(hospitalId),
    queryFn: () => emergenciesApi.list(hospitalId).then((r) => r.data),
  });
}

export function useCreateEmergency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmergencyPayload) =>
      emergenciesApi.create(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["emergencies"] }),
  });
}

export function useUpdateEmergencyStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: EmergencyStatus }) =>
      emergenciesApi.updateStatus(id, status).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["emergencies"] }),
  });
}

export function useDeleteEmergency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => emergenciesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["emergencies"] }),
  });
}

/* ---------------------------- Campagnes ---------------------------- */

export function useCampaigns(hospitalId?: string) {
  return useQuery({
    queryKey: queryKeys.campaigns(hospitalId),
    queryFn: () => campaignsApi.list(hospitalId).then((r) => r.data),
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) =>
      campaignsApi.create(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

/* ----------------------------- Recherche --------------------------- */

export function useSearchDonors() {
  return useMutation({
    mutationFn: (params: SearchParams) => searchApi.donors(params),
  });
}

/* ----------------------------- Donneurs ---------------------------- */

/**
 * Annuaire des donneurs. S'appuie pour l'instant sur des données simulées:
 * dès que `GET /api/v1/donors` est disponible, il suffira de remplacer le
 * `queryFn` par `donorsApi.list().then((r) => r.data)`.
 */
export function useDonors() {
  return useQuery({
    queryKey: ["donors", "directory"],
    queryFn: async () => {
      const { donors } = await import("@/lib/mock/donors");
      return donors;
    },
  });
}

export function useCreateDonor() {
  return useMutation({
    mutationFn: (payload: CreateDonorPayload) =>
      donorsApi.create(payload).then((r) => r.data),
  });
}

/* ---------------------------- Vérification -------------------------- */

export function useVerifyDonor(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.verify(id),
    queryFn: () => verifyApi.get(id).then((r) => r.data),
    enabled: enabled && id.length > 0,
    retry: false,
  });
}

export function useRewardDonor() {
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & RewardPayload) =>
      verifyApi.reward(id, payload).then((r) => r.data),
  });
}
