import { isApiError } from "@/lib/api/client";

/** Messages affichés pour les codes métier d'app-service liés au profil et au mot de passe. */
const MESSAGES: Record<string, string> = {
  AUTH_TOKEN_REQUIRED: "Session expirée : reconnectez-vous.",
  AUTH_TOKEN_INVALID: "Session invalide : reconnectez-vous.",
  MEMBER_NOT_FOUND: "Aucune fiche membre n'est liée à votre compte.",
  MEMBER_NAME_REQUIRED: "Nom requis.",
  MEMBER_FIRST_NAME_REQUIRED: "Prénom requis.",
  MEMBER_PHONE_NUMBER_INVALID: "Numéro de téléphone invalide (format international attendu, ex. +22670000000).",
  MEMBER_EMAIL_INVALID: "Adresse e-mail invalide.",
  MEMBER_EMAIL_ALREADY_EXISTS: "Cette adresse e-mail est déjà utilisée par un autre membre.",
  AUTH_CURRENT_PASSWORD_INVALID: "Le mot de passe actuel est incorrect.",
  CREDENTIALS_PASSWORD_INVALID:
    "Mot de passe trop faible : 8 caractères minimum, avec une lettre, un chiffre et un symbole.",
  CREDENTIALS_NOT_FOUND: "Compte introuvable : reconnectez-vous.",
  CREDENTIALS_INACTIVE: "Ce compte est désactivé.",
  VALIDATION_ERROR: "Certains champs sont invalides. Vérifiez votre saisie.",
};

const FIELD_BY_CODE: Record<string, string> = {
  MEMBER_NAME_REQUIRED: "name",
  MEMBER_FIRST_NAME_REQUIRED: "firstName",
  MEMBER_PHONE_NUMBER_INVALID: "phoneNumber",
  MEMBER_EMAIL_INVALID: "email",
  MEMBER_EMAIL_ALREADY_EXISTS: "email",
  AUTH_CURRENT_PASSWORD_INVALID: "currentPassword",
  CREDENTIALS_PASSWORD_INVALID: "newPassword",
};

export function toProfileErrorMessage(error: unknown): string {
  if (!isApiError(error)) return "L'opération a échoué. Réessayez dans un instant.";
  if (error.code === "NETWORK_ERROR") return "API injoignable : vérifiez que app-service est démarré.";
  return (error.apiCode && MESSAGES[error.apiCode]) ?? "L'opération a échoué. Réessayez dans un instant.";
}

export function toProfileFieldErrors(error: unknown): Record<string, string> | undefined {
  if (!isApiError(error) || !error.apiCode) return undefined;
  const field = FIELD_BY_CODE[error.apiCode];
  return field ? { [field]: toProfileErrorMessage(error) } : undefined;
}
