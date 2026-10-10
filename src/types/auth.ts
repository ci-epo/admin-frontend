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
  /** Fiche membre liée au compte ; `null` si aucune. */
  name: string | null;
  firstName: string | null;
  phoneNumber: string | null;
  /** Mot de passe provisoire : seule la page « Voir profil » est accessible tant qu'il n'est pas changé. */
  mustChangePassword: boolean;
  role: string;
  positions: AccessPosition[];
  permissions: string[];
}

/** Champs modifiables par l'utilisateur sur sa propre fiche (`PATCH /auth/me`). */
export interface UpdateProfileCommand {
  firstName: string;
  name: string;
  phoneNumber: string;
  email: string;
}

/** `POST /auth/change-password` : l'ancien mot de passe est exigé. */
export interface ChangePasswordCommand {
  currentPassword: string;
  newPassword: string;
}
