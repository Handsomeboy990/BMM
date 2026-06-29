/**
 * Données simulées pour la landing page. Aucun appel réseau pour l'instant:
 * ces valeurs seront remplacées par l'API lorsque le backend sera branché.
 */

export type BloodTypeAvailability = {
  group: string;
  level: number;
  status: "critique" | "faible" | "stable";
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export type LandingStat = {
  value: number;
  suffix: string;
  label: string;
};

export const landingStats: LandingStat[] = [
  { value: 12480, suffix: "+", label: "Donneurs enregistrés" },
  { value: 3, suffix: " vies", label: "Sauvées par don" },
  { value: 54, suffix: "", label: "Pays africains visés" },
  { value: 45, suffix: " s", label: "Pour diffuser une alerte" },
];

export const bloodAvailability: BloodTypeAvailability[] = [
  { group: "O-", level: 18, status: "critique" },
  { group: "O+", level: 64, status: "stable" },
  { group: "A-", level: 32, status: "faible" },
  { group: "A+", level: 71, status: "stable" },
  { group: "B-", level: 27, status: "faible" },
  { group: "B+", level: 58, status: "stable" },
  { group: "AB-", level: 15, status: "critique" },
  { group: "AB+", level: 49, status: "faible" },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Une alerte m'a notifié à temps. Trente minutes plus tard, j'avais donné mon sang pour un nouveau-né. C'est concret, c'est immédiat.",
    name: "Awa Diallo",
    role: "Donneuse, Dakar",
    initials: "AD",
  },
  {
    quote:
      "Nous trouvons des donneurs compatibles en quelques secondes au lieu de plusieurs heures. Cela change la prise en charge des urgences.",
    name: "Dr Kwame Mensah",
    role: "Médecin urgentiste, Accra",
    initials: "KM",
  },
  {
    quote:
      "Organiser une campagne est devenu simple. Les inscriptions et le suivi sont centralisés, et la mobilisation est bien plus forte.",
    name: "Fatou Bensouda",
    role: "Coordinatrice de campagne, Abidjan",
    initials: "FB",
  },
];

export const partnerRegions: string[] = [
  "Sénégal",
  "Ghana",
  "Côte d'Ivoire",
  "Nigéria",
  "Kenya",
  "Rwanda",
  "Cameroun",
  "Maroc",
];
