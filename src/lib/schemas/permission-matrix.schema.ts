import { asObject, invalidResponse, readBoolean, readString } from "@/lib/schemas/guards";
import type { PermissionOption } from "@/types/permission-matrix";

function items(value: unknown, what: string): unknown[] {
  const source = asObject(value, what);
  if (!Array.isArray(source.data)) throw invalidResponse(`${what}.data`, source.data);
  return source.data;
}

export function parseRoleListDto(value: unknown): { publicId: string; label: string; isActive: boolean }[] {
  return items(value, "roles").map((item) => {
    const source = asObject(item, "roles.data[]");
    return {
      publicId: readString(source, "publicId", "roles.data[]"),
      label: readString(source, "name", "roles.data[]"),
      isActive: readBoolean(source, "isActive", "roles.data[]"),
    };
  });
}

export function parsePermissionListDto(value: unknown): PermissionOption[] {
  return items(value, "permissions").map((item) => {
    const source = asObject(item, "permissions.data[]");
    return {
      publicId: readString(source, "publicId", "permissions.data[]"),
      name: readString(source, "name", "permissions.data[]"),
      description: readString(source, "description", "permissions.data[]"),
    };
  });
}

/** Liaisons rôle/poste ↔ permission : `permissionsId` est le `publicId` de la permission. */
export function parseLinkListDto(
  value: unknown,
  what: string,
): { linkId: string; targetId: string; permissionId: string }[] {
  return items(value, what).map((item) => {
    const source = asObject(item, `${what}.data[]`);
    return {
      linkId: readString(source, "publicId", `${what}.data[]`),
      targetId: readString(source, what === "role-permissions" ? "roleId" : "positionId", `${what}.data[]`),
      permissionId: readString(source, "permissionsId", `${what}.data[]`),
    };
  });
}
