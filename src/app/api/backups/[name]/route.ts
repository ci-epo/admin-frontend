import { downloadBackup } from "@/lib/api/administration.endpoints";
import { isApiError } from "@/lib/api/client";
import { isBackupName } from "@/lib/schemas/backup.schema";
import { readAccessToken } from "@/lib/auth/session";

interface RouteContext {
  params: Promise<{ name: string }>;
}

/**
 * Téléchargement d'une sauvegarde : l'archive est relayée en flux depuis app-service (jamais chargée en mémoire),
 * avec le jeton d'accès de la session. Lien simple (`<a download>`), protégé par le cookie SameSite=Strict.
 */
export async function GET(_request: Request, { params }: RouteContext): Promise<Response> {
  const { name } = await params;
  const token = await readAccessToken();
  if (!token) return plainText(401, "Session expirée : reconnectez-vous.");
  if (!isBackupName(name)) return plainText(400, "Nom de sauvegarde invalide.");

  try {
    const upstream = await downloadBackup(token, name);
    return new Response(upstream.body, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${name}"`,
        "Cache-Control": "no-store",
        ...(upstream.headers.get("content-length") ? { "Content-Length": upstream.headers.get("content-length")! } : {}),
      },
    });
  } catch (error) {
    console.error(`[administration] téléchargement de ${name} impossible`, error);
    const status = isApiError(error) && error.status >= 400 ? error.status : 502;
    return plainText(status, "Téléchargement impossible.");
  }
}

function plainText(status: number, message: string): Response {
  return new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
