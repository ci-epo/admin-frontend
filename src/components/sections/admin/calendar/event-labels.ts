export interface EventLabelStyle {
  bg: string;
  text: string;
  icon: string;
}

/** Style d'un libellé d'événement (classes du thème Bootstrap). */
export const LABEL_STYLES: Record<string, EventLabelStyle> = {
  Formation: { bg: "bg-success-subtle", text: "text-success", icon: "ri-presentation-line" },
  Conférence: { bg: "bg-primary-subtle", text: "text-primary", icon: "ri-mic-line" },
  Projet: { bg: "bg-warning-subtle", text: "text-warning", icon: "ri-folder-chart-line" },
  Meeting: { bg: "bg-danger-subtle", text: "text-danger", icon: "ri-video-on-fill" },
  "Sick Leave": { bg: "bg-info-subtle", text: "text-info", icon: "ri-heart-pulse-line" },
};

export const DEFAULT_LABEL_STYLE: EventLabelStyle = {
  bg: "bg-secondary-subtle",
  text: "text-secondary",
  icon: "ri-calendar-line",
};

/** Modèles d'événements glissables vers le calendrier (lus par le script vanilla via data-*). */
export const EXTERNAL_EVENTS = [
  { title: "Formation", tone: "success", description: "Session de formation" },
  { title: "Conférence", tone: "primary", description: "Conférence ou réunion publique" },
  { title: "Projet", tone: "warning", description: "Échéance ou jalon de projet" },
  { title: "Meeting", tone: "danger", description: "Réunion interne" },
] as const;
