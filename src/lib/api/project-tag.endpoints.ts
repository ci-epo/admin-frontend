import { apiClient } from "@/lib/api/client";
import { parseProjectTagListDto, type RawProjectTag } from "@/lib/schemas/project-tag.schema";
import { computeLinkChanges } from "@/lib/utils/link-selection";

const LIST_LIMIT = 100;

/** Liaisons projet ↔ tag de tous les projets (une page de 100 ; suffisant pour un club). */
export async function listProjectTags(): Promise<RawProjectTag[]> {
  const dto = await apiClient<unknown>({
    path: `/project-tags?page=1&limit=${LIST_LIMIT}`,
    method: "GET",
    cache: "no-store",
  });
  return parseProjectTagListDto(dto);
}

async function listLinksOfProject(projectId: string): Promise<RawProjectTag[]> {
  const dto = await apiClient<unknown>({
    path: `/project-tags?page=1&limit=${LIST_LIMIT}&projectId=${encodeURIComponent(projectId)}`,
    method: "GET",
    cache: "no-store",
  });
  return parseProjectTagListDto(dto);
}

async function createLink(projectId: string, tagsId: string): Promise<void> {
  await apiClient<unknown>({ path: "/project-tags", method: "POST", body: { projectId, tagsId }, cache: "no-store" });
}

async function deleteLink(linkId: string): Promise<void> {
  await apiClient<unknown>({
    path: `/project-tags/${encodeURIComponent(linkId)}`,
    method: "DELETE",
    cache: "no-store",
  });
}

/** Aligne les tags d'un projet sur la sélection : seules les différences partent vers l'API. */
export async function syncProjectTags(projectId: string, selectedTagIds: readonly string[]): Promise<void> {
  const current = await listLinksOfProject(projectId);
  const changes = computeLinkChanges(
    current.map((link) => ({ linkId: link.publicId, targetId: link.tagsId })),
    selectedTagIds,
  );
  for (const tagId of changes.toCreate) await createLink(projectId, tagId);
  for (const linkId of changes.toDelete) await deleteLink(linkId);
}
