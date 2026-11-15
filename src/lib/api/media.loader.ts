import { listMedia } from "@/lib/api/media.endpoints";
import type { MediaKind, MediaRow } from "@/types/media";

/** Médias d'une nature ; en cas d'échec de l'API, la page reste utilisable avec une liste vide. */
export async function loadMedia(kind: MediaKind): Promise<{ rows: MediaRow[]; unavailable: boolean }> {
  try {
    return { rows: await listMedia(kind), unavailable: false };
  } catch (error) {
    console.warn(`[media] ${kind} indisponibles`, error);
    return { rows: [], unavailable: true };
  }
}
