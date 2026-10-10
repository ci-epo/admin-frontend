import { MEMBER_PASSWORD_RULE, PASSWORD_PATTERN, type FormResult } from "@/lib/schemas/member.schema";
import type { ChangePasswordCommand, UpdateProfileCommand } from "@/types/auth";

function text(form: FormData, name: string): string {
  return String(form.get(name) ?? "").trim();
}

/** Fiche personnelle. Le format du téléphone et de l'e-mail est vérifié par app-service (codes `MEMBER_*_INVALID`). */
export function parseProfileForm(form: FormData): FormResult<UpdateProfileCommand> {
  const data: UpdateProfileCommand = {
    firstName: text(form, "firstName"),
    name: text(form, "name"),
    phoneNumber: text(form, "phoneNumber"),
    email: text(form, "email"),
  };

  const fieldErrors: Record<string, string> = {};
  if (!data.firstName) fieldErrors.firstName = "Prénom requis.";
  if (!data.name) fieldErrors.name = "Nom requis.";
  if (!data.phoneNumber) fieldErrors.phoneNumber = "Téléphone requis.";
  if (!data.email) fieldErrors.email = "E-mail requis.";

  return Object.keys(fieldErrors).length > 0 ? { ok: false, fieldErrors } : { ok: true, data };
}

/**
 * Changement de mot de passe. Les mots de passe ne sont jamais coupés ni normalisés : c'est exactement ce qui est saisi.
 * Le nouveau doit respecter la règle de l'API et différer de l'actuel.
 */
export function parsePasswordForm(form: FormData): FormResult<ChangePasswordCommand> {
  const currentPassword = String(form.get("currentPassword") ?? "");
  const newPassword = String(form.get("newPassword") ?? "");
  const confirmPassword = String(form.get("confirmPassword") ?? "");

  const fieldErrors: Record<string, string> = {};
  if (!currentPassword) fieldErrors.currentPassword = "Mot de passe actuel requis.";
  if (!PASSWORD_PATTERN.test(newPassword)) {
    fieldErrors.newPassword = `Nouveau mot de passe : ${MEMBER_PASSWORD_RULE}`;
  } else if (newPassword === currentPassword) {
    fieldErrors.newPassword = "Le nouveau mot de passe doit être différent de l'actuel.";
  }
  if (newPassword !== confirmPassword) fieldErrors.confirmPassword = "Les deux mots de passe ne correspondent pas.";

  return Object.keys(fieldErrors).length > 0
    ? { ok: false, fieldErrors }
    : { ok: true, data: { currentPassword, newPassword } };
}
