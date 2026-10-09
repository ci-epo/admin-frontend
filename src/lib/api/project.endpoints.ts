import { apiClient } from "@/lib/api/client";
import { asObject, readString } from "@/lib/schemas/guards";
import { parseProjectListDto } from "@/lib/schemas/project.schema";
import type { ProjectCommand, ProjectRow } from "@/types/project";

const LIST_LIMIT = 100;

export async function listProjects(): Promise<ProjectRow[]> {
  const dto = await apiClient<unknown>({
    path: `/projects?page=1&limit=${LIST_LIMIT}`,
    method: "GET",
    cache: "no-store",
  });
  return parseProjectListDto(dto);
}

/** Renvoie le `publicId` du projet créé (nécessaire pour y rattacher ses tags). */
export async function createProject(command: ProjectCommand): Promise<string> {
  const dto = await apiClient<unknown>({ path: "/projects", method: "POST", body: command, cache: "no-store" });
  return readString(asObject(dto, "project"), "publicId", "project");
}

export async function updateProject(publicId: string, command: ProjectCommand): Promise<void> {
  await apiClient<unknown>({
    path: `/projects/${encodeURIComponent(publicId)}`,
    method: "PATCH",
    body: command,
    cache: "no-store",
  });
}

export async function deleteProject(publicId: string): Promise<void> {
  await apiClient<unknown>({ path: `/projects/${encodeURIComponent(publicId)}`, method: "DELETE", cache: "no-store" });
}
