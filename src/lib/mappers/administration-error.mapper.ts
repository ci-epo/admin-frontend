import { isApiError } from "@/lib/api/client";

/** Messages affichés pour les codes métier d'app-service ; le détail technique reste dans les journaux. */
const MESSAGES: Record<string, string> = {
  AUTH_TOKEN_REQUIRED: "Session expirée : reconnectez-vous.",
  AUTH_TOKEN_INVALID: "Session invalide : reconnectez-vous.",
  PERMISSION_DENIED: "Vous n'avez pas la permission nécessaire pour cette action.",
  BACKUP_NOT_FOUND: "Cette sauvegarde n'existe plus.",
  BACKUP_NAME_INVALID: "Nom de sauvegarde invalide.",
  BACKUP_OPERATION_IN_PROGRESS:
    "Une autre opération de sauvegarde ou de restauration est en cours. Réessayez dans un instant.",
  BACKUP_TOO_LARGE: "Fichier trop volumineux pour être importé.",
  BACKUP_CONTENT_INVALID: "Ce fichier n'est pas une sauvegarde PostgreSQL (archive pg_dump au format custom).",
  BACKUP_DUMP_FAILED: "La sauvegarde de la base a échoué (détail dans les journaux de l'API).",
  SETTINGS_SITE_NAME_REQUIRED: "Le nom du site est obligatoire.",
  SETTINGS_TEXT_TOO_LONG: "Un des textes est trop long.",
  SETTINGS_EMAIL_INVALID: "Adresse e-mail invalide.",
  SETTINGS_URL_INVALID: "Un des liens est invalide (adresse http(s) complète attendue).",
  SETTINGS_ANNOUNCEMENT_MESSAGE_REQUIRED: "Un bandeau actif doit avoir un texte.",
  SETTINGS_MODULE_KEY_INVALID: "Module inconnu.",
  SETTINGS_HIDDEN_MODULES_INVALID: "Liste de modules invalide.",
};

const AUTH_CODES = new Set(["AUTH_TOKEN_REQUIRED", "AUTH_TOKEN_INVALID"]);

/** Vrai si l'API refuse le jeton d'accès : la session doit être rouverte (reconnexion). */
export function isSessionRejected(error: unknown): boolean {
  return isApiError(error) && error.apiCode !== undefined && AUTH_CODES.has(error.apiCode);
}

export function toAdministrationErrorMessage(error: unknown): string {
  if (!isApiError(error)) return "L'opération a échoué. Réessayez dans un instant.";
  if (error.code === "NETWORK_ERROR") return "API injoignable : vérifiez que app-service est démarré.";
  if (error.apiCode === "BACKUP_RESTORE_FAILED") return restoreFailureMessage(error.details);
  if (error.code === "PAYLOAD_TOO_LARGE" && !error.apiCode) return MESSAGES.BACKUP_TOO_LARGE;
  return (error.apiCode && MESSAGES[error.apiCode]) ?? "L'opération a échoué. Réessayez dans un instant.";
}

function restoreFailureMessage(details: unknown): string {
  const safety = (details as { metadata?: { safetyBackup?: unknown } } | null)?.metadata?.safetyBackup;
  const suffix = typeof safety === "string" ? ` L'état d'avant a été sauvegardé dans ${safety}.` : "";
  return `La restauration a échoué ; la base n'a pas été modifiée.${suffix}`;
}
