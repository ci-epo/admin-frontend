/**
 * Rôles autorisés à ouvrir admin-frontend : le bureau, et l'administrateur (décision 0015 d'app-service).
 * Les membres et les invités n'y ont aucun accès.
 */
const ADMIN_FRONTEND_ROLES: readonly string[] = ["bureau", "admin"];

export function canUseAdminFrontend(role: string): boolean {
  return ADMIN_FRONTEND_ROLES.includes(role);
}
