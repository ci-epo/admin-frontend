import { isApiError } from "@/lib/api/client";
import { readAccessToken } from "@/lib/auth/session";
import { mediaMessage } from "@/lib/utils/media-messages";

/**
 * Les routes `/api/media/*` reçoivent des requêtes du navigateur, sans le garde-fou des Server Actions : on refuse
 * donc toute requête venue d'un autre site (le cookie `SameSite=Strict` le fait déjà ; c'est une seconde barrière).
 */
export function rejectCrossOrigin(request: Request): Response | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  return host && new URL(origin).host === host ? null : jsonError(403, undefined, "Origine refusée.");
}

export async function requireSession(): Promise<Response | null> {
  return (await readAccessToken()) ? null : jsonError(401);
}

export function jsonError(status: number, apiCode?: string, message?: string): Response {
  return Response.json({ apiCode, message: message ?? mediaMessage(apiCode, status) }, { status });
}

/** Réponse d'erreur au format `{ apiCode, message }` lu par le formulaire d'envoi. */
export function errorResponse(error: unknown): Response {
  if (isApiError(error)) {
    const status = error.status >= 400 ? error.status : 502;
    return jsonError(status, error.apiCode);
  }
  return jsonError(500);
}

/** Copie les en-têtes utiles au lecteur (type, taille, plage, cache) d'une réponse d'app-service. */
export function relayFileHeaders(upstream: Response): Headers {
  const headers = new Headers();
  for (const name of ["content-type", "content-length", "content-range", "accept-ranges", "content-disposition"]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("Cache-Control", "private, max-age=300");
  headers.set("X-Content-Type-Options", "nosniff");
  return headers;
}
