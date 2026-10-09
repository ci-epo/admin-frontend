"use server";

import { redirect } from "next/navigation";
import { logoutSession } from "@/lib/api/auth.endpoints";
import { clearSession, readRefreshToken } from "@/lib/auth/session";

export async function logoutAction(): Promise<void> {
  const refreshToken = await readRefreshToken();
  if (refreshToken) {
    await logoutSession(refreshToken).catch((error) => {
      console.warn("[auth] déconnexion : la révocation côté API a échoué, le cookie local est effacé quand même", error);
    });
  }
  await clearSession();
  redirect("/login");
}
