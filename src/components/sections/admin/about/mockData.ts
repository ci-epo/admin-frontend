import type {
  AboutApp,
  AboutModule,
  AboutRole,
  AboutSupportLink,
  AboutSysInfo,
  AboutTechItem,
} from "@/components/sections/admin/about/types";

/* Informations système (en-tête + cartes d'état) */
export const ABOUT_APP: AboutApp = {
  name: "CIE Admin",
  tagline: "Plateforme de gestion et d'administration du Club Informatique & Électronique",
  version: "1.0.0",
  releaseDate: "Mai 2025",
};

export const ABOUT_SYSINFO: AboutSysInfo[] = [
  { icon: "ri-price-tag-3-line", value: "v1.0.0", label: "Version actuelle" },
  { icon: "ri-apps-2-line", value: "6", label: "Modules de gestion" },
  { icon: "ri-refresh-line", value: "Mai 2025", label: "Dernière mise à jour" },
  { icon: "ri-shield-check-line", value: "MIT", label: "Licence" },
];

/* Modules de la plateforme (alignés sur le menu de navigation) */
export const ABOUT_MODULES: AboutModule[] = [
  {
    icon: "ri-dashboard-line",
    title: "Tableau de bord",
    description: "Vue d'ensemble : statistiques clés, graphiques d'activité et derniers mouvements.",
    href: "/dashboard",
    color: "primary",
    status: "stable",
  },
  {
    icon: "ri-group-line",
    title: "Membres",
    description: "Annuaire des adhérents, rôles, cotisations et suivi des inscriptions.",
    href: "/member",
    color: "info",
    status: "stable",
  },
  {
    icon: "ri-calendar-event-line",
    title: "Calendrier",
    description: "Planification des réunions et événements avec rappels et vue mensuelle.",
    href: "/calendar",
    color: "success",
    status: "stable",
  },
  {
    icon: "ri-flag-line",
    title: "Activités",
    description: "Catalogue des activités du club : ateliers, projets et sorties.",
    href: "/activity",
    color: "warning",
    status: "stable",
  },
  {
    icon: "ri-wallet-3-line",
    title: "Trésorerie",
    description: "Recettes, dépenses, soldes et rapports financiers du bureau.",
    href: "/treasury",
    color: "danger",
    status: "beta",
  },
  {
    icon: "ri-archive-2-line",
    title: "Archives",
    description: "Documents officiels, médias et historique des événements passés.",
    href: "/archiver",
    color: "secondary",
    status: "stable",
  },
];

/* Rôles & permissions */
export const ABOUT_ROLES: AboutRole[] = [
  {
    role: "Administrateur",
    badgeClass: "bg-danger-subtle text-danger",
    description: "Contrôle total de la plateforme et des comptes.",
    permissions: ["Tous les modules", "Gestion des comptes", "Paramètres système"],
  },
  {
    role: "Bureau",
    badgeClass: "bg-warning-subtle text-warning",
    description: "Membres du bureau : gestion opérationnelle du club.",
    permissions: ["Membres", "Trésorerie", "Activités", "Archives"],
  },
  {
    role: "Membre",
    badgeClass: "bg-primary-subtle text-primary",
    description: "Adhérent : consultation et participation aux activités.",
    permissions: ["Calendrier", "Activités", "Documents publics"],
  },
  {
    role: "Invité",
    badgeClass: "bg-success-subtle text-success",
    description: "Accès limité en lecture aux contenus publics.",
    permissions: ["Documents publics", "Événements publics"],
  },
];

/* Pile technique */
export const ABOUT_TECH: AboutTechItem[] = [
  { icon: "ri-reactjs-line", name: "Next.js 15 + React 19", detail: "App Router, Server Components" },
  { icon: "ri-code-s-slash-line", name: "TypeScript", detail: "Typage strict de bout en bout" },
  { icon: "ri-layout-grid-line", name: "Bootstrap 5", detail: "Thème Urbix personnalisé" },
  { icon: "ri-bar-chart-box-line", name: "ApexCharts & GridJS", detail: "Graphiques et tableaux" },
  { icon: "ri-test-tube-line", name: "Jest & Playwright", detail: "Tests unitaires et e2e" },
  { icon: "ri-ship-2-line", name: "Docker", detail: "Déploiement conteneurisé" },
];

/* Support & contact */
export const ABOUT_SUPPORT: AboutSupportLink[] = [
  {
    icon: "ri-book-open-line",
    title: "Documentation",
    description: "Guides d'utilisation et bonnes pratiques pour chaque module.",
    action: "Consulter",
    href: "#",
  },
  {
    icon: "ri-bug-line",
    title: "Signaler un problème",
    description: "Un bug ou un comportement inattendu ? Faites-le nous savoir.",
    action: "Signaler",
    href: "#",
  },
  {
    icon: "ri-customer-service-2-line",
    title: "Support",
    description: "Besoin d'aide pour utiliser la plateforme ? Contactez l'équipe.",
    action: "Contacter",
    href: "#",
  },
];
