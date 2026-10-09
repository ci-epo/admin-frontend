"use server";

import { revalidatePath } from "next/cache";
import { createMember, deleteMember, updateMember } from "@/lib/api/member.endpoints";
import { toMemberErrorMessage, toMemberFieldErrors } from "@/lib/mappers/member-error.mapper";
import { parseCreateMemberForm, parseUpdateMemberForm } from "@/lib/schemas/member.schema";
import type { ActionState } from "@/types/administration";

export async function createMemberAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const parsed = parseCreateMemberForm(form);
  if (!parsed.ok) {
    return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsed.fieldErrors };
  }

  try {
    await createMember(parsed.data);
  } catch (error) {
    return { status: "error", message: toMemberErrorMessage(error), fieldErrors: toMemberFieldErrors(error) };
  }

  revalidatePath("/member");
  return { status: "success", message: "Membre ajouté." };
}

export async function updateMemberAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const publicId = String(form.get("publicId") ?? "").trim();
  const parsed = parseUpdateMemberForm(form);
  if (!parsed.ok) {
    return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsed.fieldErrors };
  }

  try {
    await updateMember(publicId, parsed.data);
  } catch (error) {
    return { status: "error", message: toMemberErrorMessage(error), fieldErrors: toMemberFieldErrors(error) };
  }

  revalidatePath("/member");
  return { status: "success", message: "Membre modifié." };
}

export async function deleteMemberAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const publicId = String(form.get("publicId") ?? "").trim();

  try {
    await deleteMember(publicId);
  } catch (error) {
    return { status: "error", message: toMemberErrorMessage(error) };
  }

  revalidatePath("/member");
  return { status: "success", message: "Membre supprimé." };
}
