/** Réponse de `GET /site-settings/web` (app-service). */
export type WebSettingsDto = {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  facebookUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  maintenanceEnabled: boolean;
  maintenanceMessage: string;
  announcementEnabled: boolean;
  announcementMessage: string;
  updatedAt: string | null;
};

/** Réponse de `GET /site-settings/admin` (app-service). */
export type AdminSettingsDto = {
  announcementEnabled: boolean;
  announcementMessage: string;
  hiddenModules: string[];
  updatedAt: string | null;
};

export interface Announcement {
  enabled: boolean;
  message: string;
}

/** Paramètres du site public, tels qu'affichés et édités dans l'administration. */
export interface WebSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  facebookUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  maintenance: Announcement;
  announcement: Announcement;
  /** `null` : valeurs par défaut, jamais enregistrées. */
  updatedAt: Date | null;
}

/** Paramètres de l'espace d'administration. */
export interface AdminSettings {
  announcement: Announcement;
  /** Clés des modules désactivés (segment d'URL : `treasury`, `member`…). */
  hiddenModules: string[];
  updatedAt: Date | null;
}

export type WebSettingsPatch = Omit<WebSettingsDto, "updatedAt">;
export type AdminSettingsPatch = Omit<AdminSettingsDto, "updatedAt">;
