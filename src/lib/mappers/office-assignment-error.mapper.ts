import { isApiError } from "@/lib/api/client";

/** Messages affichés pour les codes métier d'app-service liés aux affectations du bureau. */
const MESSAGES: Record<string, string> = {
  MEMBER_NOT_FOUND: "Ce membre n'existe plus.",
  POSITION_NOT_FOUND: "Ce poste n'existe plus.",
  MANDATE_NOT_FOUND: "Ce mandat n'existe plus.",
  DUPLICATE_OFFICE_ASSIGNMENT: "Ce membre occupe déjà ce poste pour ce mandat.",
  MEMBER_ID_INVALID: "Choisissez un membre.",
  POSITION_ID_INVALID: "Choisissez un poste.",
  MANDATE_ID_INVALID: "Choisissez un mandat.",
  BEGIN_DATE_INVALID: "Date de début invalide.",
  END_DATE_INVALID: "Date de fin invalide.",
  DATE_RANGE_INVALID: "La date de fin doit être après la date de début.",
  OFFICE_ASSIGNMENT_NOT_FOUND: "Cette affectation n'existe plus.",
};

/** Champ du formulaire à mettre en rouge pour un code métier donné, quand ça a du sens. */
const FIELD_BY_CODE: Record<string, string> = {
  MEMBER_NOT_FOUND: "memberId",
  MEMBER_ID_INVALID: "memberId",
  POSITION_NOT_FOUND: "positionId",
  POSITION_ID_INVALID: "positionId",
  MANDATE_NOT_FOUND: "mandateId",
  MANDATE_ID_INVALID: "mandateId",
  BEGIN_DATE_INVALID: "beginDate",
  END_DATE_INVALID: "endDate",
  DATE_RANGE_INVALID: "endDate",
  DUPLICATE_OFFICE_ASSIGNMENT: "mandateId",
};

export function toOfficeAssignmentErrorMessage(error: unknown): string {
  if (!isApiError(error)) return "L'opération a échoué. Réessayez dans un instant.";
  if (error.code === "NETWORK_ERROR") return "API injoignable : vérifiez que app-service est démarré.";
  return (error.apiCode && MESSAGES[error.apiCode]) ?? "L'opération a échoué. Réessayez dans un instant.";
}

export function toOfficeAssignmentFieldErrors(error: unknown): Record<string, string> | undefined {
  if (!isApiError(error) || !error.apiCode) return undefined;
  const field = FIELD_BY_CODE[error.apiCode];
  return field ? { [field]: toOfficeAssignmentErrorMessage(error) } : undefined;
}
