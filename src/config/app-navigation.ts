import {
  Bell,
  CalendarHeart,
  LayoutDashboard,
  Search,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type AppNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Badge optionnel (ex: nombre d'alertes ouvertes). */
  badge?: string;
};

export type AppNavGroup = {
  title: string;
  items: AppNavItem[];
};

export const appNav: AppNavGroup[] = [
  {
    title: "Pilotage",
    items: [
      { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
      { label: "Alertes", href: "/alerts", icon: Bell },
    ],
  },
  {
    title: "Donneurs",
    items: [
      { label: "Annuaire", href: "/donors", icon: Users },
      { label: "Recherche compatible", href: "/search", icon: Search },
    ],
  },
  {
    title: "Mobilisation",
    items: [
      { label: "Campagnes", href: "/campaigns", icon: CalendarHeart },
      { label: "Récompenses", href: "/cards", icon: Zap },
    ],
  },
];
