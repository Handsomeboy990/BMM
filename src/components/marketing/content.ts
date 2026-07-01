import { BellRing, HeartPulse, MapPin, ShieldCheck } from "lucide-react";

export const features = [
  {
    icon: BellRing,
    title: "Alerte de proximité instantanée",
    description:
      "Recevez des notifications uniquement lorsque votre groupe sanguin est requis d'urgence près de chez vous.",
  },
  {
    icon: ShieldCheck,
    title: "Identité souveraine et privée",
    description:
      "Vos données personnelles sont signées et contrôlées par vous seul grâce à des clés cryptographiques privées.",
  },
  {
    icon: HeartPulse,
    title: "Preuve d'intégrité transparente",
    description:
      "Chaque inscription et chaque don historique sont ancrés de façon immuable sur la blockchain Bitcoin.",
  },
  {
    icon: MapPin,
    title: "Reconnaissance par Lightning",
    description:
      "Recevez des récompenses en Satoshis directement sur votre portefeuille mobile après chaque don validé.",
  },
] as const;

export const steps = [
  {
    title: "Créez votre profil sécurisé",
    description:
      "Renseignez votre groupe sanguin et partagez votre position pour être répertorié dans votre région.",
  },
  {
    title: "Sécurisez vos données sur Bitcoin",
    description:
      "Votre profil génère une identité souveraine et sa preuve d'intégrité est ancrée de manière transparente.",
  },
  {
    title: "Répondez aux appels urgents",
    description:
      "Lorsqu'une alerte compatible retentit près de vous, présentez-vous au centre de collecte pour faire votre don.",
  },
  {
    title: "Recevez vos Satoshis de soutien",
    description:
      "Dès votre don validé par l'hôpital, votre portefeuille Lightning reçoit automatiquement des Satoshis.",
  },
] as const;
