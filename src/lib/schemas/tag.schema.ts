import { asObject, invalidResponse, readString } from "@/lib/schemas/guards";
import type { TagRow } from "@/types/project";

export function parseTagListDto(value: unknown): TagRow[] {
  const source = asObject(value, "tags");
  if (!Array.isArray(source.data)) throw invalidResponse("tags.data", source.data);
  return source.data.map((item) => {
    const tag = asObject(item, "tags.data[]");
    return {
      publicId: readString(tag, "publicId", "tags.data[]"),
      name: readString(tag, "name", "tags.data[]"),
      description: readString(tag, "description", "tags.data[]"),
    };
  });
}

export type FormResult<T> = { ok: true; data: T } | { ok: false; fieldErrors: Record<string, string> };

export function parseTagForm(form: FormData): FormResult<{ name: string; description: string }> {
  const name = String(form.get("name") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Le nom est requis.";
  if (!description) fieldErrors.description = "La description est requise.";
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
  return { ok: true, data: { name, description } };
}
