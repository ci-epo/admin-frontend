import { getAdminSettings, getWebSettings, listBackups } from "@/lib/api/administration.endpoints";
import { loadPermissionMatrix } from "@/lib/api/permission-matrix.loader";
import { toAdministrationErrorMessage } from "@/lib/mappers/administration-error.mapper";
import type { AdministrationLoadResult, AdministrationPanelData, AdministrationTab } from "@/types/administration";
import type { Backup } from "@/types/backup";
import type { PermissionMatrix } from "@/types/permission-matrix";
import type { AdminSettings, WebSettings } from "@/types/site-settings";

export type AdministrationData = AdministrationPanelData<WebSettings, AdminSettings, Backup, PermissionMatrix>;

const TABS: readonly AdministrationTab[] = ["site", "admin", "droits", "sauvegardes"];

/** Onglet demandé dans l'URL (`?onglet=`), « site » par défaut. */
export function parseAdministrationTab(value: unknown): AdministrationTab {
  return TABS.find((tab) => tab === value) ?? "site";
}

/** Charge l'onglet demandé (page déjà protégée par la permission `page:administration`, cf. `page.tsx`). */
export async function loadAdministrationPanel(
  tab: AdministrationTab,
  accessToken: string,
): Promise<AdministrationLoadResult<AdministrationData>> {
  try {
    return { status: "ready", data: await loadPanelData(tab, accessToken) };
  } catch (error) {
    console.error(`[administration] chargement de l'onglet ${tab} impossible`, error);
    return { status: "error", message: toAdministrationErrorMessage(error) };
  }
}

async function loadPanelData(tab: AdministrationTab, accessToken: string): Promise<AdministrationData> {
  if (tab === "site") return { tab, web: await getWebSettings() };
  if (tab === "admin") return { tab, admin: await getAdminSettings() };
  if (tab === "droits") return { tab, matrix: await loadPermissionMatrix() };
  return { tab, backups: await listBackups(accessToken) };
}
