/** Jetons renvoyés par `/auth/login|register|refresh` (app-service). */
export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
}

/** Poste du bureau occupé par l'utilisateur (`/auth/me`). */
export interface AccessPosition {
  publicId: string;
  name: string;
  shortName: string;
}

/** Identité + rôle/permissions effectives de l'utilisateur connecté (`/auth/me`). */
export interface UserAccess {
  /** Profil local ; `null` pour un compte sans poste (invité, membre). */
  userId: string | null;
  email: string | null;
  role: string;
  positions: AccessPosition[];
  permissions: string[];
}
