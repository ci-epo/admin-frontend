"use server";

import { revalidatePath } from "next/cache";
import { createActivity, deleteActivity, updateActivity } from "@/lib/api/activity.endpoints";
import { toActivityErrorMessage, toActivityFieldErrors } from "@/lib/mappers/activity-error.mapper";
import { parseCreateActivityForm, parseUpdateActivityForm } from "@/lib/schemas/activity.schema";
import type { ActionState } from "@/types/administration";

export async function createActivityAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const parsed = parseCreateActivityForm(form);
  if (!parsed.ok) {
    return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsed.fieldErrors };
  }

  try {
    await createActivity(parsed.data);
  } catch (error) {
    return { status: "error", message: toActivityErrorMessage(error), fieldErrors: toActivityFieldErrors(error) };
  }

  revalidatePath("/activity");
  return { status: "success", message: "Activité ajoutée." };
}

export async function updateActivityAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const publicId = String(form.get("publicId") ?? "").trim();
  const parsed = parseUpdateActivityForm(form);
  if (!parsed.ok) {
    return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsed.fieldErrors };
  }

  try {
    await updateActivity(publicId, parsed.data);
  } catch (error) {
    return { status: "error", message: toActivityErrorMessage(error), fieldErrors: toActivityFieldErrors(error) };
  }

  revalidatePath("/activity");
  return { status: "success", message: "Activité modifiée." };
}

export async function deleteActivityAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const publicId = String(form.get("publicId") ?? "").trim();

  try {
    await deleteActivity(publicId);
  } catch (error) {
    return { status: "error", message: toActivityErrorMessage(error) };
  }

  revalidatePath("/activity");
  return { status: "success", message: "Activité supprimée." };
}
