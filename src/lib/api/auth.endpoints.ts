import { apiClient } from "@/lib/api/client";
import { parseAuthSessionDto, parseUserAccessDto } from "@/lib/schemas/auth.schema";
import type { AuthSession, ChangePasswordCommand, UpdateProfileCommand, UserAccess } from "@/types/auth";

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

/** Modifie la fiche de l'utilisateur connecté (le jeton de la session est joint par `apiClient`). */
export async function updateMyProfile(command: UpdateProfileCommand): Promise<void> {
  await apiClient<unknown>({ path: "/auth/me", method: "PATCH", body: command, cache: "no-store" });
}

export async function changeMyPassword(command: ChangePasswordCommand): Promise<void> {
  await apiClient<unknown>({ path: "/auth/change-password", method: "POST", body: command, cache: "no-store" });
}
