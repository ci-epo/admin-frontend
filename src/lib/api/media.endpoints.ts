import { apiClient, apiRawClient } from "@/lib/api/client";
import { parseMediaDto, parseMediaListDto } from "@/lib/schemas/media.schema";
import type { MediaKind, MediaPatch, MediaRow } from "@/types/media";

const mediaPath = (publicId: string) => `/media/${encodeURIComponent(publicId)}`;

/** `limit` maximal d'app-service : au-delà, la liste est tronquée (les plus récents d'abord dans chaque ordre d'affichage). */
const LIST_LIMIT = 200;

export async function listMedia(kind: MediaKind): Promise<MediaRow[]> {
  const dto = await apiClient<unknown>({
    path: `/media?page=1&limit=${LIST_LIMIT}&kind=${kind}`,
    method: "GET",
    cache: "no-store",
  });
  return parseMediaListDto(dto);
}

export async function updateMedia(publicId: string, patch: MediaPatch): Promise<MediaRow> {
  const dto = await apiClient<unknown>({ path: mediaPath(publicId), method: "PATCH", body: patch, cache: "no-store" });
  return parseMediaDto(dto);
}

export async function deleteMedia(publicId: string): Promise<void> {
  await apiClient<unknown>({ path: mediaPath(publicId), method: "DELETE", cache: "no-store" });
}

/** Relaie l'envoi d'un fichier : le flux de la requête du navigateur est transmis tel quel à app-service. */
export async function relayMediaUpload(search: string, contentType: string, body: ReadableStream<Uint8Array> | null) {
  const response = await apiRawClient({
    path: `/media${search}`,
    method: "POST",
    headers: { "Content-Type": contentType },
    body: body ?? undefined,
    cache: "no-store",
  });
  return parseMediaDto(await response.json());
}

export async function relayPosterUpload(publicId: string, contentType: string, body: ReadableStream<Uint8Array> | null) {
  const response = await apiRawClient({
    path: `${mediaPath(publicId)}/poster`,
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: body ?? undefined,
    cache: "no-store",
  });
  return parseMediaDto(await response.json());
}

/** Fichier (ou image d'aperçu) d'un média, avec la plage d'octets demandée : indispensable pour parcourir une vidéo. */
export function openMediaFile(publicId: string, variant: "file" | "poster", options: { range?: string | null; download?: boolean }) {
  return apiRawClient({
    path: `${mediaPath(publicId)}/${variant}${options.download ? "?download=1" : ""}`,
    method: "GET",
    headers: options.range ? { Range: options.range } : undefined,
    cache: "no-store",
  });
}

export interface MediaExportPreview {
  mediaCount: number;
  totalBytes: number;
}

const exportSearch = (from: string, to: string) => `from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

/** Ce que contiendrait l'archive de la période (nombre de médias, taille), sans la fabriquer. */
export async function previewMediaExport(from: string, to: string): Promise<MediaExportPreview> {
  const dto = await apiClient<{ mediaCount?: unknown; totalBytes?: unknown }>({
    path: `/media/export/preview?${exportSearch(from, to)}`,
    method: "GET",
    cache: "no-store",
  });
  if (typeof dto?.mediaCount !== "number" || typeof dto?.totalBytes !== "number") {
    throw { code: "INVALID_RESPONSE", status: 502, message: "Aperçu de l'export illisible" };
  }
  return { mediaCount: dto.mediaCount, totalBytes: dto.totalBytes };
}

/** Archive ZIP de la période, relayée en flux : elle peut atteindre plusieurs Go. */
export function openMediaExport(from: string, to: string) {
  return apiRawClient({ path: `/media/export?${exportSearch(from, to)}`, method: "GET", cache: "no-store" });
}
