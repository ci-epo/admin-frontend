import { NextResponse, type NextRequest } from "next/server";
import { apiBaseUrl, isProduction } from "@/config/env";

const ACCESS_COOKIE_NAME = "cie_access_token";
const REFRESH_COOKIE_NAME = "cie_refresh_token";

/**
 * Rafraîchit silencieusement le jeton d'accès (courte durée, cf. `lib/auth/session.ts`) tant que le jeton de
 * rafraîchissement est valide, pour éviter de redemander la connexion toutes les 15 minutes. Un Server Component
 * ne peut pas écrire de cookie pendant son rendu (contrainte Next.js) : c'est pourquoi ce rafraîchissement a lieu
 * ici, avant que la requête n'atteigne la page.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next();

  if (request.cookies.get(ACCESS_COOKIE_NAME)?.value) {
    return response;
  }
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;
  if (!refreshToken) {
    return response;
  }

  try {
    const apiResponse = await fetch(`${apiBaseUrl()}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (!apiResponse.ok) return response;

    const session = (await apiResponse.json()) as {
      accessToken?: unknown;
      accessExpiresAt?: unknown;
    };
    if (typeof session.accessToken !== "string" || typeof session.accessExpiresAt !== "string") return response;

    const maxAge = Math.max(0, Math.floor((new Date(session.accessExpiresAt).getTime() - Date.now()) / 1000));
    response.cookies.set(ACCESS_COOKIE_NAME, session.accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: isProduction,
      path: "/",
      maxAge,
    });
  } catch (error) {
    console.warn("[middleware] rafraîchissement du jeton d'accès impossible", error);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login|api/).*)"],
};
