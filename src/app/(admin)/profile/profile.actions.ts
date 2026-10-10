"use server";

import { revalidatePath } from "next/cache";
import { changeMyPassword, updateMyProfile } from "@/lib/api/auth.endpoints";
import { toProfileErrorMessage, toProfileFieldErrors } from "@/lib/mappers/profile-error.mapper";
import { parsePasswordForm, parseProfileForm } from "@/lib/schemas/profile.schema";
import type { ActionState } from "@/types/administration";

export async function updateProfileAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const parsed = parseProfileForm(form);
  if (!parsed.ok) {
    return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsed.fieldErrors };
  }

  try {
    await updateMyProfile(parsed.data);
  } catch (error) {
    return { status: "error", message: toProfileErrorMessage(error), fieldErrors: toProfileFieldErrors(error) };
  }

  // Le nom et l'e-mail s'affichent aussi dans l'en-tête de toutes les pages.
  revalidatePath("/", "layout");
  return { status: "success", message: "Vos informations ont été enregistrées." };
}

export async function changePasswordAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const parsed = parsePasswordForm(form);
  if (!parsed.ok) {
    return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsed.fieldErrors };
  }

  try {
    await changeMyPassword(parsed.data);
  } catch (error) {
    return { status: "error", message: toProfileErrorMessage(error), fieldErrors: toProfileFieldErrors(error) };
  }

  // Lève le blocage « mot de passe provisoire » du layout : le reste de l'espace d'administration redevient accessible.
  revalidatePath("/", "layout");
  return { status: "success", message: "Votre mot de passe a été modifié." };
}
