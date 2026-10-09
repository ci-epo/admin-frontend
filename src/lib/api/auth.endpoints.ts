import { apiClient } from "@/lib/api/client";
import { parseAuthSessionDto, parseUserAccessDto } from "@/lib/schemas/auth.schema";
import type { AuthSession, UserAccess } from "@/types/auth";

const authorized = (accessToken: string) => ({
  headers: { Authorization: `Bearer ${accessToken}` },
  cache: "no-store" as const,
});

export async function login(email: string, password: string): Promise<AuthSession> {
  const dto = await apiClient<unknown>({
    path: "/auth/login",
    method: "POST",
    body: { email, password },
    cache: "no-store",
  });
  return parseAuthSessionDto(dto);
}

export async function refreshSession(refreshToken: string): Promise<AuthSession> {
  const dto = await apiClient<unknown>({
    path: "/auth/refresh",
    method: "POST",
    body: { refreshToken },
    cache: "no-store",
  });
  return parseAuthSessionDto(dto);
}

export async function logoutSession(refreshToken: string): Promise<void> {
  await apiClient<unknown>({ path: "/auth/logout", method: "POST", body: { refreshToken }, cache: "no-store" });
}

export async function me(accessToken: string): Promise<UserAccess> {
  const dto = await apiClient<unknown>({ path: "/auth/me", method: "GET", ...authorized(accessToken) });
  return parseUserAccessDto(dto);
}
