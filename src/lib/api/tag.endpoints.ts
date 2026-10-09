import { apiClient } from "@/lib/api/client";
import { parseTagListDto } from "@/lib/schemas/tag.schema";
import type { TagCommand, TagRow } from "@/types/project";

const LIST_LIMIT = 100;

export async function listTags(): Promise<TagRow[]> {
  const dto = await apiClient<unknown>({ path: `/tags?page=1&limit=${LIST_LIMIT}`, method: "GET", cache: "no-store" });
  return parseTagListDto(dto);
}

export async function createTag(command: TagCommand): Promise<void> {
  await apiClient<unknown>({ path: "/tags", method: "POST", body: command, cache: "no-store" });
}

export async function updateTag(publicId: string, command: TagCommand): Promise<void> {
  await apiClient<unknown>({
    path: `/tags/${encodeURIComponent(publicId)}`,
    method: "PATCH",
    body: command,
    cache: "no-store",
  });
}

export async function deleteTag(publicId: string): Promise<void> {
  await apiClient<unknown>({ path: `/tags/${encodeURIComponent(publicId)}`, method: "DELETE", cache: "no-store" });
}
