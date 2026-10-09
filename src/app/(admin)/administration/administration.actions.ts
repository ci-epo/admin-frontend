"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { MENU } from "@/components/sections/admin/navbar";
import {
  createPositionPermission,
  createRolePermission,
  deletePositionPermission,
  deleteRolePermission,
  listPositionLinkRefs,
  listRoleLinkRefs,
} from "@/lib/api/permission-matrix.endpoints";
import { computeLinkChanges } from "@/lib/utils/link-selection";
import {
  createBackup,
  deleteBackup,
  importBackup,
  restoreBackup,
  updateAdminSettings,
  updateWebSettings,
} from "@/lib/api/administration.endpoints";
import { isSessionRejected, toAdministrationErrorMessage } from "@/lib/mappers/administration-error.mapper";
import { BACKUP_UPLOAD_MAX_BYTES, isBackupName, RESTORE_CONFIRMATION_WORD } from "@/lib/schemas/backup.schema";
import { parseAdminSettingsForm, parseWebSettingsForm } from "@/lib/schemas/site-settings.schema";
import { toggleableModules } from "@/lib/utils/admin-modules";
import { formatBytes } from "@/lib/utils/format-bytes";
import type { ActionState } from "@/types/administration";
import { clearSession, readAccessToken } from "@/lib/auth/session";

/**
 * Points d'entrée publics : chaque action valide ses entrées et relit le jeton d'accès de la session ; l'API
 * vérifie la permission (`page:administration`) à chaque appel.
 */

const ADMINISTRATION_PATH = "/administration";

export async function saveWebSettings(_state: ActionState, form: FormData): Promise<ActionState> {
  const parsed = parseWebSettingsForm(form);
  if (!parsed.ok) return failure("Corrigez les champs signalés.", parsed.fieldErrors);
  return withAccessToken(async (token) => {
    await updateWebSettings(token, parsed.data);
    revalidatePath(ADMINISTRATION_PATH);
    return success("Paramètres du site public enregistrés. Le site public les affichera d’ici une minute.");
  });
}

export async function saveAdminSettings(_state: ActionState, form: FormData): Promise<ActionState> {
  const parsed = parseAdminSettingsForm(form, toggleableModules(MENU));
  if (!parsed.ok) return failure("Corrigez les champs signalés.", parsed.fieldErrors);
  return withAccessToken(async (token) => {
    await updateAdminSettings(token, parsed.data);
    // Menu et bandeau sont rendus par le layout : toutes les pages sont concernées.
    revalidatePath("/", "layout");
    return success("Paramètres de l'espace d'administration enregistrés.");
  });
}

export async function createBackupAction(): Promise<ActionState> {
  return withAccessToken(async (token) => {
    const backup = await createBackup(token);
    revalidatePath(ADMINISTRATION_PATH);
    return success(`Sauvegarde ${backup.name} créée (${formatBytes(backup.sizeBytes)}).`);
  });
}

export async function importBackupAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const archive = form.get("archive");
  if (!(archive instanceof Blob) || archive.size === 0) return failure("Choisissez un fichier de sauvegarde (.dump).");
  if (archive.size > BACKUP_UPLOAD_MAX_BYTES) {
    return failure(`Fichier trop volumineux (${formatBytes(BACKUP_UPLOAD_MAX_BYTES)} au maximum).`);
  }
  return withAccessToken(async (token) => {
    const backup = await importBackup(token, archive);
    revalidatePath(ADMINISTRATION_PATH);
    return success(`Fichier importé sous le nom ${backup.name}. Il peut maintenant être restauré.`);
  });
}

export async function restoreBackupAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const name = form.get("name");
  if (!isBackupName(name)) return failure("Nom de sauvegarde invalide.");
  if (String(form.get("confirmation") ?? "").trim() !== RESTORE_CONFIRMATION_WORD) {
    return failure(`Saisissez ${RESTORE_CONFIRMATION_WORD} pour confirmer.`, {
      confirmation: `Saisissez ${RESTORE_CONFIRMATION_WORD} en majuscules.`,
    });
  }
  return withAccessToken(async (token) => {
    const result = await restoreBackup(token, name);
    // Toutes les données ont pu changer (paramètres, menu…) : tout est recalculé.
    revalidatePath("/", "layout");
    return success(
      `Base restaurée depuis ${result.restored.name}. L'état précédent est conservé dans ${result.safetyBackup.name}.`,
    );
  });
}

export async function deleteBackupAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const name = form.get("name");
  if (!isBackupName(name)) return failure("Nom de sauvegarde invalide.");
  return withAccessToken(async (token) => {
    await deleteBackup(token, name);
    revalidatePath(ADMINISTRATION_PATH);
    return success(`Sauvegarde ${name} supprimée.`);
  });
}

async function withAccessToken(operation: (token: string) => Promise<ActionState>): Promise<ActionState> {
  const token = await readAccessToken();
  if (!token) redirect("/login");
  try {
    return await operation(token);
  } catch (error) {
    console.error("[administration] action refusée ou en échec", error);
    if (isSessionRejected(error)) {
      await clearSession();
      redirect("/login");
    }
    return failure(toAdministrationErrorMessage(error));
  }
}

function success(message: string): ActionState {
  return { status: "success", message };
}

function failure(message: string, fieldErrors?: Record<string, string>): ActionState {
  return { status: "error", message, fieldErrors };
}

/**
 * Enregistre les permissions cochées pour un rôle ou un poste. Seules les différences avec l'état actuel partent vers
 * l'API (créations et suppressions de liaisons). Pas de transaction côté API : une erreur en cours de route laisse
 * les changements déjà faits, et le message le dit.
 */
export async function savePermissionSelectionAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const target = parsePermissionTarget(String(form.get("target") ?? ""));
  if (!target) return { status: "error", message: "Choisissez un rôle ou un poste." };
  const selected = form.getAll("permission").map(String);

  try {
    const isRole = target.scope === "role";
    const current = isRole ? await listRoleLinkRefs(target.publicId) : await listPositionLinkRefs(target.publicId);
    const changes = computeLinkChanges(
      current.map((link) => ({ linkId: link.linkId, targetId: link.permissionId })),
      selected,
    );

    for (const permissionId of changes.toCreate) {
      if (isRole) await createRolePermission(target.publicId, permissionId);
      else await createPositionPermission(target.publicId, permissionId);
    }
    for (const linkId of changes.toDelete) {
      if (isRole) await deleteRolePermission(linkId);
      else await deletePositionPermission(linkId);
    }
  } catch (error) {
    return { status: "error", message: toAdministrationErrorMessage(error) };
  }

  revalidatePath(ADMINISTRATION_PATH);
  return { status: "success", message: "Permissions enregistrées." };
}

/** Valeur du sélecteur : `role:<publicId>` ou `position:<publicId>`. */
function parsePermissionTarget(value: string): { scope: "role" | "position"; publicId: string } | null {
  const [scope, publicId] = value.split(":", 2);
  if ((scope !== "role" && scope !== "position") || !publicId) return null;
  return { scope, publicId };
}
