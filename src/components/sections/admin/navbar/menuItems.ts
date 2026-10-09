/**
 * Source unique du menu de navigation.
 * Consommée à la fois par Sidebar (vertical) et HorizontalNav (horizontal).
 *
 * Pour ajouter une entrée : pousser dans le bon NavSection ou créer une nouvelle section.
 */

export interface NavItem {
  label: string;
  href?: string;
  /** Classe d'icône (ex: "ri-dashboard-line"). Seulement aux items de niveau 1. */
  icon?: string;
  /** ID du collapse Bootstrap, si l'item a un sous-menu */
  collapseId?: string;
  children?: NavItem[];
  /** Permission requise pour voir l'entrée (ex. "page:treasury") ; absente = accessible à tout le bureau. */
  permission?: string;
}

export interface NavSection {
  /** Titre de section affiché en gris au-dessus du groupe */
  title: string;
  items: NavItem[];
}

export const MENU: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Tableau de bord", icon: "ri-dashboard-line", collapseId: "collapseDashboards", href: "/dashboard" },
      { label: "Membres", icon: "ri-group-line", collapseId: "collapseApplications", href: "/member" },
      { label: "Calendrier", icon: "ri-calendar-2-line", collapseId: "collapseApplications", href: "/calendar" },
      { label: "Activités", icon: "ri-calendar-event-line", collapseId: "collapseApplications", href: "/activity" },
      {
        label: "Projets",
        icon: "ri-folder-chart-line",
        collapseId: "collapseApplications",
        href: "/project",
        permission: "page:project",
      },
      {
        label: "Trésorerie",
        icon: "ri-wallet-3-line",
        collapseId: "collapseApplications",
        href: "/treasury",
        permission: "page:treasury",
      },
      { label: "Archives", icon: "ri-archive-2-line", collapseId: "collapseApplications", href: "/archiver" },
      { label: "À propos", icon: "ri-information-line", collapseId: "collapseApplications", href: "/about" },
    ],
  },
  {
    title: "Système",
    items: [
      {
        label: "Administration",
        icon: "ri-settings-3-line",
        href: "/administration",
        permission: "page:administration",
      },
    ],
  },
];
