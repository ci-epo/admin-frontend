import { isApiError } from "@/lib/api/client";
import { mediaMessage, MEDIA_FALLBACK_MESSAGE } from "@/lib/utils/media-messages";

const FIELD_BY_CODE: Record<string, string> = {
  MEDIA_TITLE_REQUIRED: "title",
  MEDIA_YEAR_INVALID: "year",
  MEDIA_PLACEMENT_INVALID: "placement",
  MEDIA_SORT_ORDER_INVALID: "sortOrder",
};

export function toMediaErrorMessage(error: unknown): string {
  if (!isApiError(error)) return MEDIA_FALLBACK_MESSAGE;
  if (error.code === "NETWORK_ERROR") return "API injoignable : vérifiez que app-service est démarré.";
  return mediaMessage(error.apiCode, error.status);
}

export function toMediaFieldErrors(error: unknown): Record<string, string> | undefined {
  if (!isApiError(error) || !error.apiCode) return undefined;
  const field = FIELD_BY_CODE[error.apiCode];
  return field ? { [field]: toMediaErrorMessage(error) } : undefined;
}
