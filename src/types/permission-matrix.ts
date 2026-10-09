/** Une permission du catalogue (`permissionsTable`). */
export interface PermissionOption {
  publicId: string;
  name: string;
  description: string;
}

/** Cible à laquelle on attribue des permissions : un rôle, ou un poste du bureau (en plus du rôle). */
export interface PermissionTarget {
  scope: "role" | "position";
  publicId: string;
  label: string;
  /** Permissions déjà liées à la cible (`publicId` des permissions). */
  permissionIds: string[];
}

export interface PermissionMatrix {
  permissions: PermissionOption[];
  roles: PermissionTarget[];
  positions: PermissionTarget[];
}
