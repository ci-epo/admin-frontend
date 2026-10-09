import {
  listPermissions,
  listPositionLinkRefs,
  listRoleLinkRefs,
  listRoles,
} from "@/lib/api/permission-matrix.endpoints";
import { listPositionOptions } from "@/lib/api/office-assignment.endpoints";
import type { PermissionMatrix, PermissionTarget } from "@/types/permission-matrix";

/**
 * Catalogue des permissions et, pour chaque rôle et chaque poste, les permissions qui leur sont déjà liées.
 * Les liaisons sont lues cible par cible (filtre `roleId`/`positionId` côté API) pour ne pas dépendre de la
 * taille d'une page unique.
 */
export async function loadPermissionMatrix(): Promise<PermissionMatrix> {
  const [permissions, roles, positions] = await Promise.all([listPermissions(), listRoles(), listPositionOptions()]);

  const roleTargets: PermissionTarget[] = await Promise.all(
    roles.map(async (role) => {
      const links = await listRoleLinkRefs(role.publicId);
      return {
        scope: "role" as const,
        publicId: role.publicId,
        label: role.label,
        permissionIds: links.map((link) => link.permissionId),
      };
    }),
  );

  const positionTargets: PermissionTarget[] = await Promise.all(
    positions.map(async (position) => {
      const links = await listPositionLinkRefs(position.publicId);
      return {
        scope: "position" as const,
        publicId: position.publicId,
        label: position.label,
        permissionIds: links.map((link) => link.permissionId),
      };
    }),
  );

  return { permissions, roles: roleTargets, positions: positionTargets };
}
