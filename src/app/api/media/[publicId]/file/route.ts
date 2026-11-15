import { openMediaFile } from "@/lib/api/media.endpoints";
import { errorResponse, relayFileHeaders, requireSession } from "@/lib/api/media-route";

interface Context {
  params: Promise<{ publicId: string }>;
}

/** Lecture d'un média par le bureau (aperçu ou téléchargement), avec prise en charge des plages d'octets. */
export async function GET(request: Request, { params }: Context) {
  const refused = await requireSession();
  if (refused) return refused;

  const { publicId } = await params;
  try {
    const upstream = await openMediaFile(publicId, "file", {
      range: request.headers.get("range"),
      download: new URL(request.url).searchParams.get("download") === "1",
    });
    return new Response(upstream.body, { status: upstream.status, headers: relayFileHeaders(upstream) });
  } catch (error) {
    return errorResponse(error);
  }
}
