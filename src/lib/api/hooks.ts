"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  AUTH_BYPASS,
  DEMO_CURRENT_ORG_ID,
  demoCampaigns,
  demoDonors,
  demoEmergencies,
  demoMatches,
  demoOrganizations,
  demoStock,
  demoTransfers,
  type BloodComponent,
  type TransferRequest,
  type TransferUrgency,
} from "@/lib/dev/demo";

import {
  authApi,
  campaignsApi,
  donorsApi,
  emergenciesApi,
  organizationsApi,
  searchApi,
  stockApi,
  transfersApi,
  verifyApi,
  type CampaignRecord,
  type CreateCampaignPayload,
  type CreateDonorPayload,
  type CreateEmergencyPayload,
  type DonorRecord,
  type EmergencyRecord,
  type EmergencyStatus,
  type LoginPayload,
  type Organization,
  type RegisterOrganizationPayload,
  type RewardPayload,
  type SearchParams,
} from "./resources";

/** Délai simulé pour que les états de chargement restent visibles en démo. */
const demoDelay = <T>(value: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), 350));

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
    enabled: !AUTH_BYPASS,
    retry: false,
    staleTime: 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      AUTH_BYPASS ? Promise.resolve(null) : authApi.login(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.me }),
  });
}

export function useRegisterOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterOrganizationPayload) =>
      AUTH_BYPASS ? Promise.resolve(null) : authApi.register(payload),
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
    queryFn: () =>
      AUTH_BYPASS
        ? demoDelay(demoEmergencies)
        : emergenciesApi.list(hospitalId).then((r) => r.data),
  });
}

export function useCreateEmergency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmergencyPayload) => {
      if (AUTH_BYPASS) {
        const record: EmergencyRecord = {
          id: `demo-${Date.now()}`,
          hospitalId: "demo",
          status: "active",
          createdAt: new Date().toISOString(),
          ...payload,
        };
        qc.setQueriesData<EmergencyRecord[]>(
          { queryKey: ["emergencies"] },
          (old) => [record, ...(old ?? [])],
        );
        return Promise.resolve(record);
      }
      return emergenciesApi.create(payload).then((r) => r.data);
    },
    onSuccess: () => {
      if (!AUTH_BYPASS) qc.invalidateQueries({ queryKey: ["emergencies"] });
    },
  });
}

export function useUpdateEmergencyStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: EmergencyStatus }) => {
      if (AUTH_BYPASS) {
        qc.setQueriesData<EmergencyRecord[]>(
          { queryKey: ["emergencies"] },
          (old) => old?.map((e) => (e.id === id ? { ...e, status } : e)),
        );
        return Promise.resolve(null);
      }
      return emergenciesApi.updateStatus(id, status).then((r) => r.data);
    },
    onSuccess: () => {
      if (!AUTH_BYPASS) qc.invalidateQueries({ queryKey: ["emergencies"] });
    },
  });
}

export function useDeleteEmergency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (AUTH_BYPASS) {
        qc.setQueriesData<EmergencyRecord[]>(
          { queryKey: ["emergencies"] },
          (old) => old?.filter((e) => e.id !== id),
        );
        return Promise.resolve({ success: true });
      }
      return emergenciesApi.remove(id).then((r) => r.data);
    },
    onSuccess: () => {
      if (!AUTH_BYPASS) qc.invalidateQueries({ queryKey: ["emergencies"] });
    },
  });
}

/* ---------------------------- Campagnes ---------------------------- */

export function useCampaigns(hospitalId?: string) {
  return useQuery({
    queryKey: queryKeys.campaigns(hospitalId),
    queryFn: () =>
      AUTH_BYPASS
        ? demoDelay(demoCampaigns)
        : campaignsApi.list(hospitalId).then((r) => r.data),
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) => {
      if (AUTH_BYPASS) {
        const record: CampaignRecord = {
          ...payload,
          id: `demo-${Date.now()}`,
          hospitalId: "demo",
          targetBloodType: payload.targetBloodType ?? null,
          emailsSent: 0,
          responsesCount: 0,
          status: "active",
          createdAt: new Date().toISOString(),
        };
        qc.setQueriesData<CampaignRecord[]>(
          { queryKey: ["campaigns"] },
          (old) => [record, ...(old ?? [])],
        );
        return Promise.resolve(record);
      }
      return campaignsApi.create(payload).then((r) => r.data);
    },
    onSuccess: () => {
      if (!AUTH_BYPASS) qc.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

/* ----------------------------- Recherche --------------------------- */

export function useSearchDonors() {
  return useMutation({
    mutationFn: (params: SearchParams) =>
      AUTH_BYPASS
        ? demoDelay({
            ai: !!params.ai,
            matches: demoMatches.filter((d) => d.available),
          })
        : searchApi.donors(params),
  });
}

/* ----------------------------- Donneurs ---------------------------- */

/** Annuaire des donneurs validés (endpoint réel `GET /api/v1/donors`). */
export function useDonors() {
  return useQuery({
    queryKey: ["donors", "directory"],
    queryFn: () =>
      AUTH_BYPASS
        ? demoDelay(demoDonors)
        : donorsApi.list().then((r) => r.data),
  });
}

export function useCreateDonor() {
  return useMutation({
    mutationFn: (payload: CreateDonorPayload): Promise<DonorRecord> => {
      if (AUTH_BYPASS) {
        return demoDelay({
          ...payload,
          id: `demo-${Date.now()}`,
          otsProof: null,
          validated: false,
          createdAt: new Date().toISOString(),
        });
      }
      return donorsApi.create(payload).then((r) => r.data);
    },
  });
}

export function useValidateDonor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (AUTH_BYPASS) {
        qc.setQueriesData<DonorRecord[]>({ queryKey: ["donors"] }, (old) =>
          old?.map((d) => (d.id === id ? { ...d, validated: true } : d)),
        );
        return Promise.resolve(null);
      }
      return donorsApi.validate(id).then((r) => r.data);
    },
    onSuccess: () => {
      if (!AUTH_BYPASS) qc.invalidateQueries({ queryKey: ["donors"] });
    },
  });
}

/* ---------------------------- Vérification -------------------------- */

export function useVerifyDonor(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.verify(id),
    queryFn: () => {
      if (AUTH_BYPASS) {
        const donor = demoDonors[0];
        return demoDelay({
          donor: {
            id,
            bloodType: donor.bloodType,
            bitcoinAddress: donor.bitcoinAddress,
            profileHash: donor.profileHash,
            hasOtsProof: true,
            createdAt: donor.createdAt,
          },
          verification: {
            isTimestampVerified: true,
            details: {
              height: 842119,
              timestamp: Math.floor(Date.now() / 1000),
            },
          },
        });
      }
      return verifyApi.get(id).then((r) => r.data);
    },
    enabled: enabled && id.length > 0,
    retry: false,
  });
}

export function useRewardDonor() {
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & RewardPayload) =>
      AUTH_BYPASS
        ? demoDelay({ message: "Récompense simulée envoyée.", reward: null })
        : verifyApi.reward(id, payload).then((r) => r.data),
  });
}

/* ------------------------- Super-admin (orgs) ---------------------- */

/**
 * Liste des organisations (vue super-admin). En attente d'un endpoint
 * backend `GET /api/v1/organizations`: pour l'instant données simulées.
 */
export function useOrganizations() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: () =>
      AUTH_BYPASS
        ? demoDelay(demoOrganizations)
        : organizationsApi.list().then((r) => r.data),
  });
}

/** Vérifie une organisation (vue super-admin). Démo en attendant l'endpoint. */
export function useVerifyOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (AUTH_BYPASS) {
        qc.setQueriesData<Organization[]>(
          { queryKey: ["organizations"] },
          (old) =>
            old?.map((o) => (o.id === id ? { ...o, verified: true } : o)),
        );
        return Promise.resolve(null);
      }
      return organizationsApi.verify(id).then((r) => r.data);
    },
    onSuccess: () => {
      if (!AUTH_BYPASS) qc.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}

/* ------------------ Réseau inter-centres (démo) -------------------- */

/** Stock de la structure par composant. Démo en attendant `GET /stock`. */
export function useStock() {
  return useQuery({
    queryKey: ["stock"],
    queryFn: () =>
      AUTH_BYPASS ? demoDelay(demoStock) : stockApi.list().then((r) => r.data),
  });
}

/** Demandes de transfert du réseau. */
export function useTransfers() {
  return useQuery({
    queryKey: ["transfers"],
    queryFn: () =>
      AUTH_BYPASS
        ? demoDelay(demoTransfers)
        : transfersApi.list().then((r) => r.data),
  });
}

export type CreateTransferInput = {
  component: BloodComponent;
  bloodType: string;
  quantity: number;
  urgency: TransferUrgency;
};

/** Publie une demande de transfert vers le réseau (démo). */
export function useCreateTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTransferInput) => {
      if (AUTH_BYPASS) {
        const record: TransferRequest = {
          ...input,
          id: `trf-${Date.now()}`,
          requesterId: DEMO_CURRENT_ORG_ID,
          requesterName: "CNHU-HKM de Cotonou",
          requesterCity: "Cotonou",
          status: "ouverte",
          createdAt: new Date().toISOString(),
        };
        qc.setQueriesData<TransferRequest[]>(
          { queryKey: ["transfers"] },
          (old) => [record, ...(old ?? [])],
        );
        return Promise.resolve(record);
      }
      return transfersApi.create(input).then((r) => r.data);
    },
    onSuccess: () => {
      if (!AUTH_BYPASS) qc.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}

/** Répond favorablement à une demande du réseau. */
export function useRespondTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (AUTH_BYPASS) {
        qc.setQueriesData<TransferRequest[]>(
          { queryKey: ["transfers"] },
          (old) =>
            old?.map((t) =>
              t.id === id
                ? {
                    ...t,
                    status: "acceptée" as const,
                    responderId: DEMO_CURRENT_ORG_ID,
                    responderName: "CNHU-HKM de Cotonou",
                  }
                : t,
            ),
        );
        return Promise.resolve(null);
      }
      return transfersApi.respond(id).then((r) => r.data);
    },
    onSuccess: () => {
      if (!AUTH_BYPASS) qc.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}
