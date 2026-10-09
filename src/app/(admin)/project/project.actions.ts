"use server";

import { revalidatePath } from "next/cache";
import { createProject, deleteProject, updateProject } from "@/lib/api/project.endpoints";
import { syncProjectTags } from "@/lib/api/project-tag.endpoints";
import { createTag, deleteTag, updateTag } from "@/lib/api/tag.endpoints";
import { toProjectErrorMessage, toProjectFieldErrors } from "@/lib/mappers/project-error.mapper";
import { parseProjectForm } from "@/lib/schemas/project.schema";
import { parseTagForm } from "@/lib/schemas/tag.schema";
import type { ActionState } from "@/types/administration";

const PROJECTS_PATH = "/project";

export async function createProjectAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const parsed = parseProjectForm(form);
  if (!parsed.ok) return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsed.fieldErrors };
  const { tagIds, ...command } = parsed.data;

  try {
    const publicId = await createProject(command);
    await syncProjectTags(publicId, tagIds);
  } catch (error) {
    return { status: "error", message: toProjectErrorMessage(error), fieldErrors: toProjectFieldErrors(error) };
  }

  revalidatePath(PROJECTS_PATH);
  return { status: "success", message: "Projet ajouté." };
}

export async function updateProjectAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const publicId = String(form.get("publicId") ?? "").trim();
  const parsed = parseProjectForm(form);
  if (!parsed.ok) return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsed.fieldErrors };
  const { tagIds, ...command } = parsed.data;

  try {
    await updateProject(publicId, command);
    await syncProjectTags(publicId, tagIds);
  } catch (error) {
    return { status: "error", message: toProjectErrorMessage(error), fieldErrors: toProjectFieldErrors(error) };
  }

  revalidatePath(PROJECTS_PATH);
  return { status: "success", message: "Projet modifié." };
}

export async function deleteProjectAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const publicId = String(form.get("publicId") ?? "").trim();

  try {
    await deleteProject(publicId);
  } catch (error) {
    return { status: "error", message: toProjectErrorMessage(error) };
  }

  revalidatePath(PROJECTS_PATH);
  return { status: "success", message: "Projet supprimé." };
}

export async function createTagAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const parsed = parseTagForm(form);
  if (!parsed.ok) return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsed.fieldErrors };

  try {
    await createTag(parsed.data);
  } catch (error) {
    return { status: "error", message: toProjectErrorMessage(error) };
  }

  revalidatePath(PROJECTS_PATH);
  return { status: "success", message: "Tag ajouté." };
}

export async function updateTagAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const publicId = String(form.get("publicId") ?? "").trim();
  const parsed = parseTagForm(form);
  if (!parsed.ok) return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsed.fieldErrors };

  try {
    await updateTag(publicId, parsed.data);
  } catch (error) {
    return { status: "error", message: toProjectErrorMessage(error) };
  }

  revalidatePath(PROJECTS_PATH);
  return { status: "success", message: "Tag modifié." };
}

export async function deleteTagAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const publicId = String(form.get("publicId") ?? "").trim();

  try {
    await deleteTag(publicId);
  } catch (error) {
    return { status: "error", message: toProjectErrorMessage(error) };
  }

  revalidatePath(PROJECTS_PATH);
  return { status: "success", message: "Tag supprimé." };
}
