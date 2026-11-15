import { relayMediaUpload } from "@/lib/api/media.endpoints";
import { errorResponse, rejectCrossOrigin, requireSession } from "@/lib/api/media-route";

/** Envoi d'un fichier : le corps du navigateur est transmis à app-service en flux, sans passer par la mémoire. */
export async function POST(request: Request) {
  const refused = rejectCrossOrigin(request) ?? (await requireSession());
  if (refused) return refused;

  try {
    const media = await relayMediaUpload(
      new URL(request.url).search,
      request.headers.get("content-type") ?? "",
      request.body,
    );
    return Response.json(media, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
