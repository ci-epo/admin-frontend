import type { AdminSettings, AdminSettingsDto, WebSettings, WebSettingsDto } from "@/types/site-settings";

const toDate = (iso: string | null): Date | null => (iso ? new Date(iso) : null);

export function toWebSettings(dto: WebSettingsDto): WebSettings {
  return {
    siteName: dto.siteName,
    siteDescription: dto.siteDescription,
    contactEmail: dto.contactEmail,
    facebookUrl: dto.facebookUrl,
    linkedinUrl: dto.linkedinUrl,
    githubUrl: dto.githubUrl,
    maintenance: { enabled: dto.maintenanceEnabled, message: dto.maintenanceMessage },
    announcement: { enabled: dto.announcementEnabled, message: dto.announcementMessage },
    updatedAt: toDate(dto.updatedAt),
  };
}

export function toAdminSettings(dto: AdminSettingsDto): AdminSettings {
  return {
    announcement: { enabled: dto.announcementEnabled, message: dto.announcementMessage },
    hiddenModules: dto.hiddenModules,
    updatedAt: toDate(dto.updatedAt),
  };
}

/** Quand l'API est injoignable, l'administration reste utilisable : aucun bandeau, tous les modules actifs. */
export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  announcement: { enabled: false, message: "" },
  hiddenModules: [],
  updatedAt: null,
};
