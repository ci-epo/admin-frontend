import { isApiError } from "@/lib/api/client";

/** Messages affichés pour les codes métier d'app-service liés aux créneaux. */
const MESSAGES: Record<string, string> = {
  SCHEDULE_NOT_FOUND: "Ce créneau n'existe plus.",
  SCHEDULE_DATE_INVALID: "Date invalide.",
  SCHEDULE_DATE_IN_PAST: "La date doit être dans le futur.",
  SCHEDULE_BEGIN_HOUR_INVALID: "Heure de début invalide.",
  SCHEDULE_END_HOUR_INVALID: "Heure de fin invalide.",
  SCHEDULE_HOUR_RANGE_INVALID: "L'heure de fin doit être après l'heure de début.",
  SCHEDULE_LOCALISATION_REQUIRED: "Lieu requis.",
};

/** Champ du formulaire à mettre en rouge pour un code métier donné, quand ça a du sens. */
const FIELD_BY_CODE: Record<string, string> = {
  SCHEDULE_DATE_INVALID: "date",
  SCHEDULE_DATE_IN_PAST: "date",
  SCHEDULE_BEGIN_HOUR_INVALID: "beginHour",
  SCHEDULE_END_HOUR_INVALID: "endHour",
  SCHEDULE_HOUR_RANGE_INVALID: "endHour",
  SCHEDULE_LOCALISATION_REQUIRED: "localisation",
};

export function toScheduleErrorMessage(error: unknown): string {
  if (!isApiError(error)) return "L'opération a échoué. Réessayez dans un instant.";
  if (error.code === "NETWORK_ERROR") return "API injoignable : vérifiez que app-service est démarré.";
  return (error.apiCode && MESSAGES[error.apiCode]) ?? "L'opération a échoué. Réessayez dans un instant.";
}

export function toScheduleFieldErrors(error: unknown): Record<string, string> | undefined {
  if (!isApiError(error) || !error.apiCode) return undefined;
  const field = FIELD_BY_CODE[error.apiCode];
  return field ? { [field]: toScheduleErrorMessage(error) } : undefined;
}
