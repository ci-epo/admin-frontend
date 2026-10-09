import { asObject, invalidResponse, readString } from "@/lib/schemas/guards";

export interface RawProjectTag {
  publicId: string;
  projectId: string;
  tagsId: string;
}

export function parseProjectTagListDto(value: unknown): RawProjectTag[] {
  const source = asObject(value, "project-tags");
  if (!Array.isArray(source.data)) throw invalidResponse("project-tags.data", source.data);
  return source.data.map((item) => {
    const link = asObject(item, "project-tags.data[]");
    return {
      publicId: readString(link, "publicId", "project-tags.data[]"),
      projectId: readString(link, "projectId", "project-tags.data[]"),
      tagsId: readString(link, "tagsId", "project-tags.data[]"),
    };
  });
}
