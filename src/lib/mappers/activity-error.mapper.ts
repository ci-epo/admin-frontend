import { isApiError } from "@/lib/api/client";

/** Messages affichés pour les codes métier d'app-service liés aux activités. */
const MESSAGES: Record<string, string> = {
  ACTIVITY_NOT_FOUND: "Cette activité n'existe plus.",
  ACTIVITY_NAME_REQUIRED: "Nom requis.",
  ACTIVITY_TYPE_INVALID: "Type d'activité invalide.",
  ACTIVITY_SCHEDULE_ID_INVALID: "Choisissez un créneau.",
  ACTIVITY_MANDATE_ID_INVALID: "Choisissez un mandat.",
  ACTIVITY_TRAINER_ID_INVALID: "Choisissez un formateur.",
  ACTIVITY_TRAINER_SCHEDULE_CONFLICT: "Ce formateur anime déjà une autre activité sur ce créneau.",
  ACTIVITY_NOT_MODIFIABLE_AFTER_SCHEDULE: "Cette activité ne peut plus être modifiée : son créneau est passé.",
};

/** Champ du formulaire à mettre en rouge pour un code métier donné, quand ça a du sens. */
const FIELD_BY_CODE: Record<string, string> = {
  ACTIVITY_NAME_REQUIRED: "name",
  ACTIVITY_TYPE_INVALID: "type",
  ACTIVITY_SCHEDULE_ID_INVALID: "scheduleId",
  ACTIVITY_MANDATE_ID_INVALID: "mandateId",
  ACTIVITY_TRAINER_ID_INVALID: "trainerId",
  ACTIVITY_TRAINER_SCHEDULE_CONFLICT: "scheduleId",
};

export function toActivityErrorMessage(error: unknown): string {
  if (!isApiError(error)) return "L'opération a échoué. Réessayez dans un instant.";
  if (error.code === "NETWORK_ERROR") return "API injoignable : vérifiez que app-service est démarré.";
  return (error.apiCode && MESSAGES[error.apiCode]) ?? "L'opération a échoué. Réessayez dans un instant.";
}

export function toActivityFieldErrors(error: unknown): Record<string, string> | undefined {
  if (!isApiError(error) || !error.apiCode) return undefined;
  const field = FIELD_BY_CODE[error.apiCode];
  return field ? { [field]: toActivityErrorMessage(error) } : undefined;
}
