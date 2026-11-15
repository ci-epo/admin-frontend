"use server";

import { revalidatePath } from "next/cache";
import { deleteMedia, updateMedia } from "@/lib/api/media.endpoints";
import { toMediaErrorMessage, toMediaFieldErrors } from "@/lib/mappers/media-error.mapper";
import { parseMediaForm } from "@/lib/schemas/media.schema";
import type { ActionState } from "@/types/administration";

/** Photos, vidéos et archives partagent les mêmes fiches : on rafraîchit les trois pages. */
const refreshPages = () => ["/photos", "/videos", "/archiver"].forEach((path) => revalidatePath(path));

export async function updateMediaAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const parsed = parseMediaForm(form);
  if (!parsed.ok) return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsed.fieldErrors };

  try {
    await updateMedia(parsed.data.publicId, parsed.data.patch);
  } catch (error) {
    return { status: "error", message: toMediaErrorMessage(error), fieldErrors: toMediaFieldErrors(error) };
  }

  refreshPages();
  return { status: "success", message: "Modifications enregistrées." };
}

export async function deleteMediaAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const publicId = String(form.get("publicId") ?? "").trim();

  try {
    await deleteMedia(publicId);
  } catch (error) {
    return { status: "error", message: toMediaErrorMessage(error) };
  }

  refreshPages();
  return { status: "success", message: "Supprimé." };
}
