/**
 * Contenu de la page « À propos ».
 *
 * La mission et la vision sont reprises mot pour mot de la présentation de
 * l'équipe (`docs/team/presentation-hemora.pdf`), pour que le discours du site
 * et celui des slides ne divergent pas. Modifiez le texte ici, jamais dans les
 * composants.
 */

export const aboutContent = {
  team: {
    /** Nom de l'équipe qui a construit la plateforme. */
    name: "Times Care",
    eyebrow: "L'équipe HEMORA",
    title: "Ceux qui construisent le réseau qui sauve des vies",
    context: "Hackathon Bitcoin 2026",
    photo: {
      src: "/team/equipe-times-care.jpg",
      alt: "Les quatre membres de l'équipe Times Care, en t-shirt HEMORA",
      width: 1079,
      height: 716,
    },
  },

  mission: {
    eyebrow: "Le don de sang",
    title: "Un geste simple. Une vie sauvée.",
    body: "Partout en Afrique, des milliers de personnes se mobilisent chaque jour pour donner leur sang. HEMORA existe pour que cet élan collectif ne se perde jamais dans le chaos logistique.",
  },

  vision: {
    eyebrow: "Notre vision",
    title: "Un seul cœur qui bat pour toute l'Afrique",
    body: "Relier chaque hôpital, chaque banque de sang et chaque donneur du continent dans un même réseau vérifiable, pour qu'aucun patient ne meure jamais par manque de sang.",
    image: {
      src: "/team/vision-afrique.jpg",
      alt: "Carte de l'Afrique parcourue de liaisons lumineuses convergeant vers un cœur",
      width: 1400,
      height: 875,
    },
  },
} as const;

/**
 * Ce que la plateforme fait aujourd'hui. Chaque ligne correspond à une
 * fonctionnalité livrée, pas à une intention: si une promesse disparaît du
 * produit, elle disparaît d'ici.
 */
export const aboutPillars = [
  {
    title: "Trouver le bon donneur",
    body: "Recherche par groupe sanguin et par distance, alertes d'urgence ciblées vers les donneurs compatibles les plus proches du besoin.",
  },
  {
    title: "Prouver sans exposer",
    body: "Chaque carte de donneur est signée et vérifiable, en ligne comme hors connexion, sans jamais divulguer les informations médicales qu'elle protège.",
  },
  {
    title: "Reconnaître le geste",
    body: "Une récompense versée après validation du don, sur Mobile Money ou en Bitcoin, sans que le donneur ait à gérer un portefeuille.",
  },
  {
    title: "Faire circuler entre centres",
    body: "Suivi du stock par composant et par groupe, et demandes de transfert entre structures voisines quand une réserve descend trop bas.",
  },
] as const;

export type AboutVideo = {
  /** Chemin du fichier dans `public/`, ex. `/team/demo.mp4`. */
  src: string;
  title: string;
  description?: string;
  /** Image affichée avant lecture. */
  poster?: string;
};

/**
 * Vidéos de présentation. La section correspondante ne s'affiche que si cette
 * liste contient au moins une entrée: tant qu'elle est vide, aucun cadre vide
 * n'apparaît sur la page.
 */
export const aboutVideos: AboutVideo[] = [];
