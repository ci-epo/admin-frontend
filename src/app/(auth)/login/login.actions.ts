"use server";

import { canUseAdminFrontend } from "@/lib/auth/access-role";
import { redirect } from "next/navigation";
import { login, me } from "@/lib/api/auth.endpoints";
import { storeSession } from "@/lib/auth/session";
import { isApiError } from "@/lib/api/client";
import type { ActionState } from "@/types/administration";

/** Connexion : réservée au bureau (seul rôle avec accès à admin-frontend, cf. décision 0015 d'`app-service`). */
export async function loginAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return failure("Saisissez votre e-mail et votre mot de passe.");

  try {
    const session = await login(email, password);
    const access = await me(session.accessToken);
    if (!canUseAdminFrontend(access.role)) {
      return failure("Accès réservé au bureau et aux administrateurs : ce compte n'a pas (ou plus) l'un de ces rôles.");
    }
    await storeSession(session);
  } catch (error) {
    return failure(loginErrorMessage(error));
  }

  redirect("/dashboard");
}

function loginErrorMessage(error: unknown): string {
  if (!isApiError(error)) return "Connexion impossible. Réessayez dans un instant.";
  if (error.code === "NETWORK_ERROR") return "API injoignable : vérifiez que app-service est démarré.";
  if (error.apiCode === "AUTH_INVALID_CREDENTIALS") return "E-mail ou mot de passe incorrect.";
  if (error.apiCode === "CREDENTIALS_INACTIVE") return "Ce compte est désactivé.";
  return "Connexion impossible. Réessayez dans un instant.";
}

function failure(message: string): ActionState {
  return { status: "error", message };
}
