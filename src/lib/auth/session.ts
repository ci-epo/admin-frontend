import { cookies } from "next/headers";
import { isProduction } from "@/config/env";
import type { AuthSession } from "@/types/auth";

/**
 * Session d'administration : jeton d'accès (courte durée) et jeton de rafraîchissement (longue durée) d'app-service,
 * gardés dans deux cookies httpOnly, illisibles par le JavaScript de la page, envoyés seulement aux requêtes du même
 * site. Remplace l'ancien jeton statique partagé (`ADMIN_API_TOKEN`) : l'identité est désormais celle d'un compte réel.
 */
const ACCESS_COOKIE_NAME = "cie_access_token";
const REFRESH_COOKIE_NAME = "cie_refresh_token";

const cookieOptions = (maxAgeSeconds: number) => ({
  httpOnly: true,
  sameSite: "strict" as const,
  secure: isProduction,
  path: "/",
  maxAge: Math.max(0, maxAgeSeconds),
});

function secondsUntil(isoDate: string): number {
  return Math.floor((new Date(isoDate).getTime() - Date.now()) / 1000);
}

export async function readAccessToken(): Promise<string | null> {
  return (await cookies()).get(ACCESS_COOKIE_NAME)?.value || null;
}

export async function readRefreshToken(): Promise<string | null> {
  return (await cookies()).get(REFRESH_COOKIE_NAME)?.value || null;
}

/** Server Actions, Route Handlers et middleware uniquement (Next.js refuse l'écriture de cookies pendant un rendu). */
export async function storeSession(session: AuthSession): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_COOKIE_NAME, session.accessToken, cookieOptions(secondsUntil(session.accessExpiresAt)));
  store.set(REFRESH_COOKIE_NAME, session.refreshToken, cookieOptions(secondsUntil(session.refreshExpiresAt)));
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE_NAME);
  store.delete(REFRESH_COOKIE_NAME);
}
