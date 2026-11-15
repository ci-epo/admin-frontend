import { previewMediaExport } from "@/lib/api/media.endpoints";
import { errorResponse, jsonError, requireSession } from "@/lib/api/media-route";
import { parseExportRange } from "@/lib/schemas/media-export.schema";

/** Nombre de médias et taille de l'archive d'une période, avant de la télécharger. */
export async function GET(request: Request) {
  const refused = await requireSession();
  if (refused) return refused;

  const params = new URL(request.url).searchParams;
  const range = parseExportRange(params.get("from"), params.get("to"));
  if (!range) return jsonError(400, "MEDIA_EXPORT_RANGE_INVALID");

  try {
    return Response.json(await previewMediaExport(range.from, range.to), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
