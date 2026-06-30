import type {
  CampaignRecord,
  DonorRecord,
  EmergencyRecord,
  MatchingDonor,
  UserProfile,
} from "@/lib/api/resources";

/**
 * Mode démo / bypass d'authentification.
 *
 * Activé via `NEXT_PUBLIC_AUTH_BYPASS=true` dans `.env`. Quand il est actif,
 * l'espace applicatif s'ouvre sans session et les écrans sont alimentés par
 * des données simulées — utile pour parcourir l'UI tant que l'authentification
 * Supabase n'est pas opérationnelle. À laisser désactivé en production.
 */
export const AUTH_BYPASS = process.env.NEXT_PUBLIC_AUTH_BYPASS === "true";

const DEMO_ORG_ID = "11111111-1111-4111-8111-111111111111";

export const BYPASS_USER: UserProfile = {
  id: "00000000-0000-4000-8000-000000000000",
  email: "demo@bitcoinblood.africa",
  role: "org_admin",
  organizationId: DEMO_ORG_ID,
  organization: {
    id: DEMO_ORG_ID,
    name: "Hôpital Démo de Dakar",
    type: "hospital",
    latitude: 14.6928,
    longitude: -17.4467,
    city: "Dakar",
    contactEmail: "contact@hopital-demo.sn",
    verified: true,
    createdAt: new Date().toISOString(),
  },
};

const now = Date.now();
const iso = (minutesAgo: number) =>
  new Date(now - minutesAgo * 60_000).toISOString();

export const demoEmergencies: EmergencyRecord[] = [
  {
    id: "aaaaaaa1-0000-4000-8000-000000000001",
    hospitalId: DEMO_ORG_ID,
    bloodType: "O-",
    quantityNeeded: 6,
    city: "Dakar",
    latitude: 14.6928,
    longitude: -17.4467,
    status: "active",
    createdAt: iso(12),
  },
  {
    id: "aaaaaaa1-0000-4000-8000-000000000002",
    hospitalId: DEMO_ORG_ID,
    bloodType: "AB-",
    quantityNeeded: 3,
    city: "Dakar",
    latitude: 14.71,
    longitude: -17.46,
    status: "active",
    createdAt: iso(48),
  },
  {
    id: "aaaaaaa1-0000-4000-8000-000000000003",
    hospitalId: DEMO_ORG_ID,
    bloodType: "B+",
    quantityNeeded: 4,
    city: "Dakar",
    latitude: 14.68,
    longitude: -17.45,
    status: "resolved",
    createdAt: iso(1440),
  },
];

export const demoCampaigns: CampaignRecord[] = [
  {
    id: "bbbbbbb1-0000-4000-8000-000000000001",
    hospitalId: DEMO_ORG_ID,
    title: "Collecte solidaire de juillet",
    type: "general",
    targetBloodType: null,
    city: "Dakar",
    latitude: 14.6928,
    longitude: -17.4467,
    radiusKm: 25,
    emailsSent: 1240,
    responsesCount: 312,
    status: "active",
    createdAt: iso(2880),
  },
  {
    id: "bbbbbbb1-0000-4000-8000-000000000002",
    hospitalId: DEMO_ORG_ID,
    title: "Urgence O- — appel ciblé",
    type: "targeted",
    targetBloodType: "O-",
    city: "Dakar",
    latitude: 14.6928,
    longitude: -17.4467,
    radiusKm: 15,
    emailsSent: 480,
    responsesCount: 96,
    status: "active",
    createdAt: iso(720),
  },
];

const baseDonor = (
  i: number,
  data: Pick<
    DonorRecord,
    "firstName" | "lastName" | "bloodType" | "city" | "age"
  > &
    Partial<DonorRecord>,
): DonorRecord => ({
  id: `ccccccc1-0000-4000-8000-00000000000${i}`,
  email: `${data.firstName.toLowerCase()}@exemple.africa`,
  phoneNumber: "+221 77 000 00 0" + i,
  latitude: 14.69 + i * 0.01,
  longitude: -17.44 - i * 0.01,
  available: true,
  bitcoinAddress: `bc1qdemo${i}xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`,
  profileHash: "0".repeat(63) + i,
  otsProof: null,
  validated: true,
  createdAt: iso(5000 + i * 100),
  ...data,
});

export const demoDonors: DonorRecord[] = [
  baseDonor(1, {
    firstName: "Aïssatou",
    lastName: "Diallo",
    bloodType: "O-",
    city: "Dakar",
    age: 29,
  }),
  baseDonor(2, {
    firstName: "Mamadou",
    lastName: "Sow",
    bloodType: "O+",
    city: "Dakar",
    age: 35,
  }),
  baseDonor(3, {
    firstName: "Fatou",
    lastName: "Ndiaye",
    bloodType: "A+",
    city: "Thiès",
    age: 41,
    validated: false,
  }),
  baseDonor(4, {
    firstName: "Cheikh",
    lastName: "Fall",
    bloodType: "B+",
    city: "Dakar",
    age: 24,
  }),
  baseDonor(5, {
    firstName: "Awa",
    lastName: "Ba",
    bloodType: "AB-",
    city: "Rufisque",
    age: 38,
    available: false,
  }),
];

export const demoMatches: MatchingDonor[] = demoDonors
  .filter((d) => d.available)
  .map((d, i) => ({
    ...d,
    distanceKm: 1.2 + i * 2.4,
    score: 92 - i * 7,
    explanation:
      i === 0
        ? "Compatible, très proche et donneur régulier."
        : "Compatible et disponible à proximité.",
    historyCount: 5 - i,
  }));
