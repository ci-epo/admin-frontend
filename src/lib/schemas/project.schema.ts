import { asObject, invalidResponse, readBoolean, readString } from "@/lib/schemas/guards";
import type { ProjectCommand, ProjectRow } from "@/types/project";

/** Formulaire projet : champs du projet + tags cochés (`publicId`). */
export interface ProjectFormData extends ProjectCommand {
  tagIds: string[];
}

export type FormResult<T> = { ok: true; data: T } | { ok: false; fieldErrors: Record<string, string> };

export function parseProjectListDto(value: unknown): ProjectRow[] {
  const source = asObject(value, "projects");
  if (!Array.isArray(source.data)) throw invalidResponse("projects.data", source.data);
  return source.data.map((item) => {
    const project = asObject(item, "projects.data[]");
    return {
      publicId: readString(project, "publicId", "projects.data[]"),
      title: readString(project, "title", "projects.data[]"),
      description: readString(project, "description", "projects.data[]"),
      githubUrl: readString(project, "githubUrl", "projects.data[]"),
      addressUrl: readString(project, "addressUrl", "projects.data[]"),
      isPublic: readBoolean(project, "isPublic", "projects.data[]"),
      // Résolus par le loader à partir des liaisons projet ↔ tag.
      tags: [],
    };
  });
}

/** `http` ou `https` uniquement : un lien sans schéma ne mènerait nulle part. */
export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseProjectForm(form: FormData): FormResult<ProjectFormData> {
  const text = (name: string) => String(form.get(name) ?? "").trim();
  const data: ProjectCommand = {
    title: text("title"),
    description: text("description"),
    githubUrl: text("githubUrl"),
    addressUrl: text("addressUrl"),
    isPublic: form.get("isPublic") === "on",
  };
  const tagIds = form.getAll("tag").map(String).filter(Boolean);

  const fieldErrors: Record<string, string> = {};
  if (!data.title) fieldErrors.title = "Le titre est requis.";
  if (!data.description) fieldErrors.description = "La description est requise.";
  if (!isHttpUrl(data.githubUrl)) fieldErrors.githubUrl = "Lien GitHub invalide (http ou https).";
  if (!isHttpUrl(data.addressUrl)) fieldErrors.addressUrl = "Lien de démonstration invalide (http ou https).";

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
  return { ok: true, data: { ...data, tagIds } };
}
