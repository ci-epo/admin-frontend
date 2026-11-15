import { openMediaFile, relayPosterUpload } from "@/lib/api/media.endpoints";
import { errorResponse, rejectCrossOrigin, relayFileHeaders, requireSession } from "@/lib/api/media-route";

interface Context {
  params: Promise<{ publicId: string }>;
}

export async function GET(_request: Request, { params }: Context) {
  const refused = await requireSession();
  if (refused) return refused;

  const { publicId } = await params;
  try {
    const upstream = await openMediaFile(publicId, "poster", {});
    return new Response(upstream.body, { status: upstream.status, headers: relayFileHeaders(upstream) });
  } catch (error) {
    return errorResponse(error);
  }
}

/** Remplace l'image d'aperçu d'une vidéo (corps : l'image brute). */
export async function PUT(request: Request, { params }: Context) {
  const refused = rejectCrossOrigin(request) ?? (await requireSession());
  if (refused) return refused;

  const { publicId } = await params;
  try {
    const media = await relayPosterUpload(publicId, request.headers.get("content-type") ?? "", request.body);
    return Response.json(media);
  } catch (error) {
    return errorResponse(error);
  }
}
