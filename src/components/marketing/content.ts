import {
  BellRing,
  CalendarHeart,
  HeartPulse,
  MapPin,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

export const features = [
  {
    icon: UsersRound,
    title: "Donneurs volontaires",
    description:
      "Enregistrez votre profil et votre groupe sanguin en quelques minutes, en toute confidentialité.",
  },
  {
    icon: MapPin,
    title: "Recherche compatible",
    description:
      "Retrouvez rapidement des donneurs compatibles à proximité du lieu de l'urgence.",
  },
  {
    icon: BellRing,
    title: "Alertes ciblées",
    description:
      "Notifiez instantanément les bons donneurs lorsqu'une vie est en jeu.",
  },
  {
    icon: CalendarHeart,
    title: "Campagnes de don",
    description:
      "Organisez et suivez vos campagnes de collecte, de l'inscription au bilan.",
  },
  {
    icon: ShieldCheck,
    title: "Cartes vérifiables",
    description:
      "Cartes physiques et numériques dont l'authenticité est vérifiable en un instant.",
  },
  {
    icon: HeartPulse,
    title: "Preuves Bitcoin",
    description:
      "L'intégrité des données est ancrée sur Bitcoin, vérifiable publiquement.",
  },
] as const;

export const steps = [
  {
    title: "Inscrivez-vous",
    description:
      "Créez votre profil de donneur et renseignez votre groupe sanguin et votre zone.",
  },
  {
    title: "Soyez alerté",
    description:
      "Recevez une notification dès qu'un besoin compatible survient près de chez vous.",
  },
  {
    title: "Sauvez des vies",
    description:
      "Rendez-vous au point de collecte et confirmez votre don en toute simplicité.",
  },
] as const;
