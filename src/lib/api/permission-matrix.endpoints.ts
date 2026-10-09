import { apiClient } from "@/lib/api/client";
import { parseLinkListDto, parsePermissionListDto, parseRoleListDto } from "@/lib/schemas/permission-matrix.schema";
import type { PermissionOption } from "@/types/permission-matrix";

const LIST_LIMIT = 100;

export interface RoleOption {
  publicId: string;
  label: string;
  isActive: boolean;
}

export async function listRoles(): Promise<RoleOption[]> {
  const dto = await apiClient<unknown>({ path: `/roles?page=1&limit=${LIST_LIMIT}`, method: "GET", cache: "no-store" });
  return parseRoleListDto(dto);
}

export async function listPermissions(): Promise<PermissionOption[]> {
  const dto = await apiClient<unknown>({
    path: `/permissions?page=1&limit=${LIST_LIMIT}`,
    method: "GET",
    cache: "no-store",
  });
  return parsePermissionListDto(dto);
}

export async function listRoleLinkRefs(roleId: string) {
  const dto = await apiClient<unknown>({
    path: `/role-permissions?page=1&limit=${LIST_LIMIT}&roleId=${encodeURIComponent(roleId)}`,
    method: "GET",
    cache: "no-store",
  });
  return parseLinkListDto(dto, "role-permissions");
}

export async function listPositionLinkRefs(positionId: string) {
  const dto = await apiClient<unknown>({
    path: `/position-permissions?page=1&limit=${LIST_LIMIT}&positionId=${encodeURIComponent(positionId)}`,
    method: "GET",
    cache: "no-store",
  });
  return parseLinkListDto(dto, "position-permissions");
}

export async function createRolePermission(roleId: string, permissionsId: string): Promise<void> {
  await apiClient<unknown>({
    path: "/role-permissions",
    method: "POST",
    body: { roleId, permissionsId },
    cache: "no-store",
  });
}

export async function deleteRolePermission(linkId: string): Promise<void> {
  await apiClient<unknown>({
    path: `/role-permissions/${encodeURIComponent(linkId)}`,
    method: "DELETE",
    cache: "no-store",
  });
}

export async function createPositionPermission(positionId: string, permissionsId: string): Promise<void> {
  await apiClient<unknown>({
    path: "/position-permissions",
    method: "POST",
    body: { positionId, permissionsId },
    cache: "no-store",
  });
}

export async function deletePositionPermission(linkId: string): Promise<void> {
  await apiClient<unknown>({
    path: `/position-permissions/${encodeURIComponent(linkId)}`,
    method: "DELETE",
    cache: "no-store",
  });
}
