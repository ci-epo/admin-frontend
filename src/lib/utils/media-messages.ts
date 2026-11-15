import { formatBytes } from "@/lib/utils/format-bytes";
import { MEDIA_MAX_BYTES } from "@/lib/schemas/media.schema";

const MESSAGES: Record<string, string> = {
  MEDIA_NOT_FOUND: "Ce média n'existe plus.",
  MEDIA_FILE_MISSING: "Le fichier est introuvable sur le serveur.",
  MEDIA_TOO_LARGE: "Fichier trop volumineux.",
  MEDIA_POSTER_NOT_VIDEO: "Seule une vidéo peut avoir une image d'aperçu.",
  MEDIA_TITLE_REQUIRED: "Le titre est requis.",
  MEDIA_FIELD_TOO_LONG: "Un des textes est trop long.",
  MEDIA_KIND_INVALID: "Nature de média invalide.",
  MEDIA_PLACEMENT_INVALID: "Page du site invalide.",
  MEDIA_YEAR_INVALID: "Année invalide.",
  MEDIA_SORT_ORDER_INVALID: "Ordre d'affichage invalide.",
  MEDIA_FORMAT_UNSUPPORTED: "Format de fichier non pris en charge.",
  MEDIA_EXPORT_RANGE_INVALID: "Période invalide : la date de début doit précéder la date de fin.",
  MEDIA_EXPORT_EMPTY: "Aucun média n'a été archivé sur cette période.",
  MEDIA_EXPORT_BUSY: "Un autre export est déjà en cours : réessayez dans quelques minutes.",
  MEDIA_CONTENT_INVALID: "Le contenu du fichier ne correspond pas à son format (fichier vide ou corrompu).",
};

export const MEDIA_FALLBACK_MESSAGE = "L'opération a échoué. Réessayez dans un instant.";

/** Message français pour un code métier d'app-service (ou, à défaut, le statut HTTP). Sans dépendance serveur. */
export function mediaMessage(apiCode?: string, status?: number): string {
  if (apiCode && MESSAGES[apiCode]) return MESSAGES[apiCode];
  if (status === 401) return "Session expirée : rechargez la page et reconnectez-vous.";
  if (status === 403) return "Vous n'avez pas le droit de gérer les médias.";
  if (status === 413) return "Fichier trop volumineux.";
  if (status === 0) return "API injoignable : vérifiez la connexion.";
  return MEDIA_FALLBACK_MESSAGE;
}

export const mediaLimitLabel = (kind: keyof typeof MEDIA_MAX_BYTES): string => `${formatBytes(MEDIA_MAX_BYTES[kind])} au plus`;
