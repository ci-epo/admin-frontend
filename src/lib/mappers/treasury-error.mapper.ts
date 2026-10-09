import { isApiError } from "@/lib/api/client";

/**
 * Messages pour les codes métier d'app-service liés à la trésorerie. Couvre les deux appels du formulaire
 * « Nouvelle opération » (création de l'opérateur, puis de la transaction).
 */
const MESSAGES: Record<string, string> = {
  OPERATOR_NAME_REQUIRED: "Nom requis.",
  OPERATOR_PHONE_INVALID: "Numéro de téléphone invalide.",
  OPERATOR_WHATSAPP_INVALID: "Numéro de téléphone invalide.",
  TRANSACTION_NOT_FOUND: "Cette opération n'existe plus.",
  TRANSACTION_DESCRIPTION_REQUIRED: "Objectif requis.",
  TRANSACTION_AMOUNT_INVALID: "Montant invalide.",
  TRANSACTION_DATE_INVALID: "Date invalide.",
  TRANSACTION_ROAD_INVALID: "Moyen de paiement invalide.",
  TRANSACTION_ACCOUNT_ID_INVALID: "Caisse invalide.",
  TRANSACTION_CATEGORY_ID_INVALID: "Catégorie invalide.",
  TRANSACTION_OPERATOR_ID_INVALID: "Opérateur invalide.",
  ACCOUNT_NOT_FOUND: "Cette caisse n'existe plus.",
  CATEGORY_NOT_FOUND: "Cette catégorie n'existe plus.",
  OPERATOR_NOT_FOUND: "Cet opérateur n'existe plus.",
  DUPLICATE_TRANSACTION: "Une opération identique existe déjà.",
};

/** Champ du formulaire à mettre en rouge pour un code métier donné, quand ça a du sens. */
const FIELD_BY_CODE: Record<string, string> = {
  OPERATOR_NAME_REQUIRED: "operatorName",
  OPERATOR_PHONE_INVALID: "operatorPhone",
  OPERATOR_WHATSAPP_INVALID: "operatorPhone",
  TRANSACTION_DESCRIPTION_REQUIRED: "objectif",
  TRANSACTION_AMOUNT_INVALID: "amount",
  TRANSACTION_DATE_INVALID: "date",
  TRANSACTION_ROAD_INVALID: "road",
  TRANSACTION_ACCOUNT_ID_INVALID: "accountId",
  TRANSACTION_CATEGORY_ID_INVALID: "categoryId",
};

export function toTreasuryErrorMessage(error: unknown): string {
  if (!isApiError(error)) return "L'opération a échoué. Réessayez dans un instant.";
  if (error.code === "NETWORK_ERROR") return "API injoignable : vérifiez que app-service est démarré.";
  return (error.apiCode && MESSAGES[error.apiCode]) ?? "L'opération a échoué. Réessayez dans un instant.";
}

export function toTreasuryFieldErrors(error: unknown): Record<string, string> | undefined {
  if (!isApiError(error) || !error.apiCode) return undefined;
  const field = FIELD_BY_CODE[error.apiCode];
  return field ? { [field]: toTreasuryErrorMessage(error) } : undefined;
}
