/**
 * Types côté frontend reflétant les ressources exposées par l'API.
 * Découplés des modules serveur pour ne jamais importer de code serveur
 * dans le bundle client. Les dates transitent en chaîne ISO via JSON.
 */

export const BLOOD_TYPES = [
  "O-",
  "O+",
  "A-",
  "A+",
  "B-",
  "B+",
  "AB-",
  "AB+",
] as const;

export type BloodType = (typeof BLOOD_TYPES)[number];

export type OrganizationType = "hospital" | "ong" | "collect";

export type Organization = {
  id: string;
  name: string;
  type: OrganizationType;
  latitude: number;
  longitude: number;
  city: string;
  contactEmail: string;
  verified: boolean;
  createdAt: string;
};

export type UserProfile = {
  id: string;
  email: string | undefined;
  role: "super_admin" | "org_admin";
  organizationId: string | null;
  organization?: Organization | null;
};

export type EmergencyStatus = "active" | "resolved" | "cancelled";

export type EmergencyRecord = {
  id: string;
  hospitalId: string;
  bloodType: BloodType;
  quantityNeeded: number;
  city: string;
  latitude: number;
  longitude: number;
  status: EmergencyStatus;
  createdAt: string;
};

export type CampaignType = "targeted" | "general";

export type CampaignRecord = {
  id: string;
  hospitalId: string;
  title: string;
  type: CampaignType;
  targetBloodType: BloodType | null;
  city: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  emailsSent: number;
  responsesCount: number;
  status: string;
  createdAt: string;
};

export type DonorRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bloodType: BloodType;
  city: string;
  latitude: number;
  longitude: number;
  age: number;
  available: boolean;
  bitcoinAddress: string;
  profileHash: string;
  otsProof: string | null;
  createdAt: string;
};

/** Donneur renvoyé par /search, enrichi de la distance (et du score en IA). */
export type MatchingDonor = DonorRecord & {
  distanceKm: number;
  score?: number;
  explanation?: string;
  historyCount?: number;
};

export type VerifyResult = {
  donor: {
    id: string;
    bloodType: BloodType;
    bitcoinAddress: string;
    profileHash: string;
    hasOtsProof: boolean;
    createdAt: string;
  };
  verification: {
    isTimestampVerified: boolean;
    details: { height: number; timestamp: number } | null;
  };
};
