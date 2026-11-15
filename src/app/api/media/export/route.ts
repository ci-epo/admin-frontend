import { openMediaExport } from "@/lib/api/media.endpoints";
import { errorResponse, jsonError, requireSession } from "@/lib/api/media-route";
import { parseExportRange } from "@/lib/schemas/media-export.schema";

/**
 * Téléchargement de l'archive ZIP des médias d'une période (page Sauvegardes). Relayée en flux depuis app-service :
 * jamais chargée en mémoire. Lien simple (`<a download>`), protégé par le cookie SameSite=Strict.
 */
export async function GET(request: Request) {
  const refused = await requireSession();
  if (refused) return refused;

  const params = new URL(request.url).searchParams;
  const range = parseExportRange(params.get("from"), params.get("to"));
  if (!range) return jsonError(400, "MEDIA_EXPORT_RANGE_INVALID");

  try {
    const upstream = await openMediaExport(range.from, range.to);
    const headers = new Headers({ "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    for (const name of ["content-type", "content-disposition", "content-length"]) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }
    return new Response(upstream.body, { status: 200, headers });
  } catch (error) {
    return errorResponse(error);
  }
}
