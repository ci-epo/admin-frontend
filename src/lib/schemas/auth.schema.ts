import { asObject, invalidResponse, readNullableString, readString, readStringArray } from "@/lib/schemas/guards";
import type { AccessPosition, AuthSession, UserAccess } from "@/types/auth";

export function parseAuthSessionDto(value: unknown): AuthSession {
  const what = "auth session";
  const source = asObject(value, what);
  return {
    accessToken: readString(source, "accessToken", what),
    refreshToken: readString(source, "refreshToken", what),
    accessExpiresAt: readString(source, "accessExpiresAt", what),
    refreshExpiresAt: readString(source, "refreshExpiresAt", what),
  };
}

function parsePosition(value: unknown): AccessPosition {
  const what = "position";
  const source = asObject(value, what);
  return {
    publicId: readString(source, "publicId", what),
    name: readString(source, "name", what),
    shortName: readString(source, "shortName", what),
  };
}

/** Champ de fiche absent (ancienne version de l'API) ou `null` : pas de valeur. */
function readProfileField(source: Record<string, unknown>, key: string, what: string): string | null {
  return source[key] === undefined ? null : readNullableString(source, key, what);
}

export function parseUserAccessDto(value: unknown): UserAccess {
  const what = "user access";
  const source = asObject(value, what);
  const positions = source.positions;
  if (!Array.isArray(positions)) throw invalidResponse(`${what}.positions`, positions);
  return {
    userId: readNullableString(source, "userId", what),
    email: readNullableString(source, "email", what),
    name: readProfileField(source, "name", what),
    firstName: readProfileField(source, "firstName", what),
    phoneNumber: readProfileField(source, "phoneNumber", what),
    mustChangePassword: source.mustChangePassword === true,
    role: readString(source, "role", what),
    positions: positions.map(parsePosition),
    permissions: readStringArray(source, "permissions", what),
  };
}
