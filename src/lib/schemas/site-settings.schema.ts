import { asObject, readBoolean, readNullableString, readString, readStringArray } from "@/lib/schemas/guards";
import type { AdminModule } from "@/types/administration";
import type { AdminSettingsDto, AdminSettingsPatch, WebSettingsDto, WebSettingsPatch } from "@/types/site-settings";

/** Mêmes limites que le domaine d'app-service (qui reste seul juge) : l'erreur s'affiche au bon champ. */
export const SETTINGS_MAX_LENGTH = {
  siteName: 120,
  siteDescription: 300,
  url: 300,
  maintenanceMessage: 500,
  announcementMessage: 280,
} as const;

export type FormResult<T> = { ok: true; data: T } | { ok: false; fieldErrors: Record<string, string> };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_FIELDS = ["facebookUrl", "linkedinUrl", "githubUrl"] as const;

export function parseWebSettingsDto(value: unknown): WebSettingsDto {
  const what = "webSettings";
  const source = asObject(value, what);
  return {
    siteName: readString(source, "siteName", what),
    siteDescription: readString(source, "siteDescription", what),
    contactEmail: readString(source, "contactEmail", what),
    facebookUrl: readString(source, "facebookUrl", what),
    linkedinUrl: readString(source, "linkedinUrl", what),
    githubUrl: readString(source, "githubUrl", what),
    maintenanceEnabled: readBoolean(source, "maintenanceEnabled", what),
    maintenanceMessage: readString(source, "maintenanceMessage", what),
    announcementEnabled: readBoolean(source, "announcementEnabled", what),
    announcementMessage: readString(source, "announcementMessage", what),
    updatedAt: readNullableString(source, "updatedAt", what),
  };
}

export function parseAdminSettingsDto(value: unknown): AdminSettingsDto {
  const what = "adminSettings";
  const source = asObject(value, what);
  return {
    announcementEnabled: readBoolean(source, "announcementEnabled", what),
    announcementMessage: readString(source, "announcementMessage", what),
    hiddenModules: readStringArray(source, "hiddenModules", what),
    updatedAt: readNullableString(source, "updatedAt", what),
  };
}

export function parseWebSettingsForm(form: FormData): FormResult<WebSettingsPatch> {
  const data: WebSettingsPatch = {
    siteName: text(form, "siteName"),
    siteDescription: text(form, "siteDescription"),
    contactEmail: text(form, "contactEmail"),
    facebookUrl: text(form, "facebookUrl"),
    linkedinUrl: text(form, "linkedinUrl"),
    githubUrl: text(form, "githubUrl"),
    maintenanceEnabled: form.get("maintenanceEnabled") === "on",
    maintenanceMessage: text(form, "maintenanceMessage"),
    announcementEnabled: form.get("announcementEnabled") === "on",
    announcementMessage: text(form, "announcementMessage"),
  };
  const errors: Record<string, string> = {};
  if (!data.siteName) errors.siteName = "Le nom du site est obligatoire.";
  checkLength(errors, data, "siteName", SETTINGS_MAX_LENGTH.siteName);
  checkLength(errors, data, "siteDescription", SETTINGS_MAX_LENGTH.siteDescription);
  if (!EMAIL_PATTERN.test(data.contactEmail)) errors.contactEmail = "Adresse e-mail invalide.";
  for (const field of URL_FIELDS) {
    if (data[field] && !isHttpUrl(data[field])) errors[field] = "Adresse http(s) complète attendue, ou champ vide.";
  }
  checkLength(errors, data, "maintenanceMessage", SETTINGS_MAX_LENGTH.maintenanceMessage);
  checkAnnouncement(errors, data.announcementEnabled, data.announcementMessage);
  return result(data, errors);
}

/** Les cases cochées sont les modules actifs ; l'API enregistre ceux qui ne le sont pas. */
export function parseAdminSettingsForm(form: FormData, modules: AdminModule[]): FormResult<AdminSettingsPatch> {
  const active = new Set(form.getAll("activeModules").map(String));
  const data: AdminSettingsPatch = {
    announcementEnabled: form.get("announcementEnabled") === "on",
    announcementMessage: text(form, "announcementMessage"),
    hiddenModules: modules.map((module) => module.key).filter((key) => !active.has(key)),
  };
  const errors: Record<string, string> = {};
  checkAnnouncement(errors, data.announcementEnabled, data.announcementMessage);
  return result(data, errors);
}

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function checkLength<T extends Record<string, unknown>>(
  errors: Record<string, string>,
  data: T,
  key: keyof T & string,
  max: number,
) {
  const value = data[key];
  if (typeof value === "string" && value.length > max && !errors[key]) {
    errors[key] = `${max} caractères au maximum.`;
  }
}

function checkAnnouncement(errors: Record<string, string>, enabled: boolean, message: string) {
  if (message.length > SETTINGS_MAX_LENGTH.announcementMessage) {
    errors.announcementMessage = `${SETTINGS_MAX_LENGTH.announcementMessage} caractères au maximum.`;
  } else if (enabled && !message) {
    errors.announcementMessage = "Saisissez le texte du bandeau, ou désactivez-le.";
  }
}

function isHttpUrl(value: string): boolean {
  if (value.length > SETTINGS_MAX_LENGTH.url || /\s/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function result<T>(data: T, errors: Record<string, string>): FormResult<T> {
  return Object.keys(errors).length > 0 ? { ok: false, fieldErrors: errors } : { ok: true, data };
}
