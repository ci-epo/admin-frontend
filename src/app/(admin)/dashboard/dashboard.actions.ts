"use server";

import { revalidatePath } from "next/cache";
import {
  createOfficeAssignment,
  deleteOfficeAssignment,
  updateOfficeAssignment,
} from "@/lib/api/office-assignment.endpoints";
import {
  toOfficeAssignmentErrorMessage,
  toOfficeAssignmentFieldErrors,
} from "@/lib/mappers/office-assignment-error.mapper";
import {
  parseCreateOfficeAssignmentForm,
  parseUpdateOfficeAssignmentForm,
} from "@/lib/schemas/office-assignment.schema";
import type { ActionState } from "@/types/administration";

export async function createOfficeAssignmentAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const parsed = parseCreateOfficeAssignmentForm(form);
  if (!parsed.ok) {
    return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsed.fieldErrors };
  }

  try {
    await createOfficeAssignment(parsed.data);
  } catch (error) {
    return {
      status: "error",
      message: toOfficeAssignmentErrorMessage(error),
      fieldErrors: toOfficeAssignmentFieldErrors(error),
    };
  }

  revalidatePath("/dashboard");
  return { status: "success", message: "Affectation ajoutée au bureau." };
}

export async function updateOfficeAssignmentAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const publicId = String(form.get("publicId") ?? "").trim();
  const parsed = parseUpdateOfficeAssignmentForm(form);
  if (!parsed.ok) {
    return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsed.fieldErrors };
  }

  try {
    await updateOfficeAssignment(publicId, parsed.data);
  } catch (error) {
    return {
      status: "error",
      message: toOfficeAssignmentErrorMessage(error),
      fieldErrors: toOfficeAssignmentFieldErrors(error),
    };
  }

  revalidatePath("/dashboard");
  return { status: "success", message: "Affectation modifiée." };
}

export async function deleteOfficeAssignmentAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const publicId = String(form.get("publicId") ?? "").trim();

  try {
    await deleteOfficeAssignment(publicId);
  } catch (error) {
    return { status: "error", message: toOfficeAssignmentErrorMessage(error) };
  }

  revalidatePath("/dashboard");
  return { status: "success", message: "Affectation supprimée." };
}
