"use server";

import { revalidatePath } from "next/cache";
import { createSchedule, deleteSchedule, updateSchedule } from "@/lib/api/schedule.endpoints";
import { toScheduleErrorMessage, toScheduleFieldErrors } from "@/lib/mappers/schedule-error.mapper";
import { parseCreateScheduleForm, parseUpdateScheduleForm } from "@/lib/schemas/schedule.schema";
import type { ActionState } from "@/types/administration";

export async function createScheduleAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const parsed = parseCreateScheduleForm(form);
  if (!parsed.ok) {
    return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsed.fieldErrors };
  }

  try {
    await createSchedule(parsed.data);
  } catch (error) {
    return { status: "error", message: toScheduleErrorMessage(error), fieldErrors: toScheduleFieldErrors(error) };
  }

  revalidatePath("/calendar");
  return { status: "success", message: "Créneau ajouté." };
}

export async function updateScheduleAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const publicId = String(form.get("publicId") ?? "").trim();
  const parsed = parseUpdateScheduleForm(form);
  if (!parsed.ok) {
    return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsed.fieldErrors };
  }

  try {
    await updateSchedule(publicId, parsed.data);
  } catch (error) {
    return { status: "error", message: toScheduleErrorMessage(error), fieldErrors: toScheduleFieldErrors(error) };
  }

  revalidatePath("/calendar");
  return { status: "success", message: "Créneau modifié." };
}

export async function deleteScheduleAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const publicId = String(form.get("publicId") ?? "").trim();

  try {
    await deleteSchedule(publicId);
  } catch (error) {
    return { status: "error", message: toScheduleErrorMessage(error) };
  }

  revalidatePath("/calendar");
  return { status: "success", message: "Créneau supprimé." };
}
