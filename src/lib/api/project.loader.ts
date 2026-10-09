import { listProjects } from "@/lib/api/project.endpoints";
import { listProjectTags } from "@/lib/api/project-tag.endpoints";
import { listTags } from "@/lib/api/tag.endpoints";
import type { ProjectRow, TagRow } from "@/types/project";

export interface ProjectBoardData {
  rows: ProjectRow[];
  tags: TagRow[];
}

const EMPTY: ProjectBoardData = { rows: [], tags: [] };

/**
 * Projets, tags et liaisons chargés ensemble : chaque projet reçoit ses tags résolus, sans appel par ligne.
 * En cas d'échec de l'API, la page reste utilisable avec une liste vide.
 */
export async function loadProjectBoard(): Promise<ProjectBoardData> {
  try {
    const [projects, tags, links] = await Promise.all([listProjects(), listTags(), listProjectTags()]);
    const rows = projects.map((project) => ({
      ...project,
      tags: links
        .filter((link) => link.projectId === project.publicId)
        .map((link) => tags.find((tag) => tag.publicId === link.tagsId))
        .filter((tag): tag is TagRow => tag !== undefined),
    }));
    return { rows, tags };
  } catch (error) {
    console.warn("[project] projets indisponibles", error);
    return EMPTY;
  }
}
