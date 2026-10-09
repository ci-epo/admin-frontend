import { apiClient, apiRawClient } from "@/lib/api/client";
import { toBackup, toRestoreBackupResult } from "@/lib/mappers/backup.mapper";
import { DEFAULT_ADMIN_SETTINGS, toAdminSettings, toWebSettings } from "@/lib/mappers/site-settings.mapper";
import { parseBackupDto, parseBackupListDto, parseRestoreBackupDto } from "@/lib/schemas/backup.schema";
import { parseAdminSettingsDto, parseWebSettingsDto } from "@/lib/schemas/site-settings.schema";
import type { Backup, RestoreBackupResult } from "@/types/backup";
import type { AdminSettings, AdminSettingsPatch, WebSettings, WebSettingsPatch } from "@/types/site-settings";

/** Routes d'administration d'app-service : jeton d'accès transmis en `Bearer`, jamais mis en cache. */
const authorized = (token: string) => ({ headers: { Authorization: `Bearer ${token}` }, cache: "no-store" as const });
const backupPath = (name: string) => `/backups/${encodeURIComponent(name)}`;

export async function getWebSettings(): Promise<WebSettings> {
  const dto = await apiClient<unknown>({ path: "/site-settings/web", method: "GET", cache: "no-store" });
  return toWebSettings(parseWebSettingsDto(dto));
}

export async function getAdminSettings(): Promise<AdminSettings> {
  const dto = await apiClient<unknown>({ path: "/site-settings/admin", method: "GET", cache: "no-store" });
  return toAdminSettings(parseAdminSettingsDto(dto));
}

export async function updateWebSettings(token: string, patch: WebSettingsPatch): Promise<WebSettings> {
  const dto = await apiClient<unknown>({
    path: "/site-settings/web",
    method: "PATCH",
    body: patch,
    ...authorized(token),
  });
  return toWebSettings(parseWebSettingsDto(dto));
}

export async function updateAdminSettings(token: string, patch: AdminSettingsPatch): Promise<AdminSettings> {
  const dto = await apiClient<unknown>({
    path: "/site-settings/admin",
    method: "PATCH",
    body: patch,
    ...authorized(token),
  });
  return toAdminSettings(parseAdminSettingsDto(dto));
}

export async function listBackups(token: string): Promise<Backup[]> {
  const dto = await apiClient<unknown>({ path: "/backups", method: "GET", ...authorized(token) });
  return parseBackupListDto(dto).map(toBackup);
}

export async function createBackup(token: string): Promise<Backup> {
  const dto = await apiClient<unknown>({ path: "/backups", method: "POST", ...authorized(token) });
  return toBackup(parseBackupDto(dto));
}

export async function importBackup(token: string, archive: Blob): Promise<Backup> {
  const response = await apiRawClient({ path: "/backups/import", method: "POST", body: archive, ...authorized(token) });
  return toBackup(parseBackupDto(await response.json()));
}

export async function restoreBackup(token: string, name: string): Promise<RestoreBackupResult> {
  const dto = await apiClient<unknown>({ path: `${backupPath(name)}/restore`, method: "POST", ...authorized(token) });
  return toRestoreBackupResult(parseRestoreBackupDto(dto));
}

export async function deleteBackup(token: string, name: string): Promise<void> {
  await apiClient<unknown>({ path: backupPath(name), method: "DELETE", ...authorized(token) });
}

/** Réponse brute de l'API (archive en flux), relayée telle quelle au navigateur par un Route Handler. */
export async function downloadBackup(token: string, name: string): Promise<Response> {
  return apiRawClient({ path: `${backupPath(name)}/download`, method: "GET", ...authorized(token) });
}

/** Paramètres de l'administration, ou valeurs neutres si l'API est injoignable (le menu reste utilisable). */
export async function getAdminSettingsOrDefault(): Promise<AdminSettings> {
  try {
    return await getAdminSettings();
  } catch (error) {
    console.warn("[admin] paramètres de l'administration indisponibles, valeurs par défaut", error);
    return DEFAULT_ADMIN_SETTINGS;
  }
}

/** Vrai si le module (segment d'URL) a été désactivé depuis la page Administration. */
export async function isModuleDisabled(moduleKey: string): Promise<boolean> {
  return (await getAdminSettingsOrDefault()).hiddenModules.includes(moduleKey);
}
