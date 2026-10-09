import { isApiError } from "@/lib/api/client";

const MESSAGES: Record<string, string> = {
  PROJECT_NOT_FOUND: "Ce projet n'existe plus.",
  DUPLICATE_PROJECT: "Ce projet existe déjà.",
  PROJECT_TITLE_REQUIRED: "Le titre est requis.",
  PROJECT_DESCRIPTION_REQUIRED: "La description est requise.",
  PROJECT_GITHUB_URL_INVALID: "Lien GitHub invalide.",
  PROJECT_ADDRESS_URL_INVALID: "Lien de démonstration invalide.",
  PROJECT_IS_PUBLIC_INVALID: "Visibilité invalide.",
  TAG_NOT_FOUND: "Ce tag n'existe plus.",
  TAG_NAME_REQUIRED: "Le nom est requis.",
  TAG_DESCRIPTION_REQUIRED: "La description est requise.",
  DUPLICATE_TAG: "Ce tag existe déjà.",
  DUPLICATE_PROJECT_TAG: "Ce tag est déjà rattaché à ce projet.",
};

const FIELD_BY_CODE: Record<string, string> = {
  PROJECT_TITLE_REQUIRED: "title",
  PROJECT_DESCRIPTION_REQUIRED: "description",
  PROJECT_GITHUB_URL_INVALID: "githubUrl",
  PROJECT_ADDRESS_URL_INVALID: "addressUrl",
};

const FALLBACK = "L'opération a échoué. Réessayez dans un instant.";

export function toProjectErrorMessage(error: unknown): string {
  if (!isApiError(error)) return FALLBACK;
  if (error.code === "NETWORK_ERROR") return "API injoignable : vérifiez que app-service est démarré.";
  return (error.apiCode && MESSAGES[error.apiCode]) ?? FALLBACK;
}

export function toProjectFieldErrors(error: unknown): Record<string, string> | undefined {
  if (!isApiError(error) || !error.apiCode) return undefined;
  const field = FIELD_BY_CODE[error.apiCode];
  return field ? { [field]: toProjectErrorMessage(error) } : undefined;
}
