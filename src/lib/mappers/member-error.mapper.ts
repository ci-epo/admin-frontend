import { isApiError } from "@/lib/api/client";

/** Messages affichés pour les codes métier d'app-service liés aux membres. */
const MESSAGES: Record<string, string> = {
  MEMBER_NOT_FOUND: "Ce membre n'existe plus.",
  MEMBER_NAME_REQUIRED: "Nom requis.",
  MEMBER_FIRST_NAME_REQUIRED: "Prénom requis.",
  MEMBER_PHONE_NUMBER_INVALID: "Numéro de téléphone invalide.",
  MEMBER_EMAIL_INVALID: "Adresse e-mail invalide.",
  MEMBER_EMAIL_ALREADY_EXISTS: "Cette adresse e-mail est déjà utilisée par un autre membre.",
  MEMBER_HAS_OFFICE_ASSIGNMENTS: "Ce membre a encore une affectation au bureau : retirez-la d'abord.",
  CREDENTIALS_PASSWORD_INVALID:
    "Mot de passe trop faible : 8 caractères minimum, avec une lettre, un chiffre et un symbole.",
};

/** Champ du formulaire à mettre en rouge pour un code métier donné, quand ça a du sens. */
const FIELD_BY_CODE: Record<string, string> = {
  MEMBER_NAME_REQUIRED: "name",
  MEMBER_FIRST_NAME_REQUIRED: "firstName",
  MEMBER_PHONE_NUMBER_INVALID: "phoneNumber",
  MEMBER_EMAIL_INVALID: "email",
  MEMBER_EMAIL_ALREADY_EXISTS: "email",
  CREDENTIALS_PASSWORD_INVALID: "password",
};

export function toMemberErrorMessage(error: unknown): string {
  if (!isApiError(error)) return "L'opération a échoué. Réessayez dans un instant.";
  if (error.code === "NETWORK_ERROR") return "API injoignable : vérifiez que app-service est démarré.";
  return (error.apiCode && MESSAGES[error.apiCode]) ?? "L'opération a échoué. Réessayez dans un instant.";
}

export function toMemberFieldErrors(error: unknown): Record<string, string> | undefined {
  if (!isApiError(error) || !error.apiCode) return undefined;
  const field = FIELD_BY_CODE[error.apiCode];
  return field ? { [field]: toMemberErrorMessage(error) } : undefined;
}
