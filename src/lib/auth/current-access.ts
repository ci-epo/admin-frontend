import { me } from "@/lib/api/auth.endpoints";
import { readAccessToken } from "@/lib/auth/session";
import type { UserAccess } from "@/types/auth";

/**
 * Identité/rôle/permissions de l'utilisateur connecté, ou `null` si aucune session valide. Le rafraîchissement du
 * jeton d'accès expiré a déjà eu lieu dans le middleware (un Server Component ne peut pas écrire de cookie) :
 * ici, un jeton absent ou refusé signifie que la session est bien terminée.
 */
export async function getCurrentAccess(): Promise<UserAccess | null> {
  const accessToken = await readAccessToken();
  if (!accessToken) return null;
  try {
    return await me(accessToken);
  } catch (error) {
    console.warn("[auth] session invalide ou expirée", error);
    return null;
  }
}

/** Vrai si l'utilisateur connecté a la permission donnée (ex. `page:treasury`). */
export function hasPermission(access: UserAccess | null, permission: string): boolean {
  return access?.permissions.includes(permission) ?? false;
}
