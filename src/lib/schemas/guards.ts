import type { ApiError } from "@/types/api";

type Json = Record<string, unknown>;

/** Réponse de l'API qui ne respecte pas le contrat attendu : traitée comme une erreur serveur. */
export function invalidResponse(what: string, details?: unknown): ApiError {
  return { status: 0, code: "SERVER_ERROR", message: `Unexpected API response: ${what}`, details };
}

export function asObject(value: unknown, what: string): Json {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw invalidResponse(what, value);
  }
  return value as Json;
}

export function readString(source: Json, key: string, what: string): string {
  const value = source[key];
  if (typeof value !== "string") throw invalidResponse(`${what}.${key}`, value);
  return value;
}

export function readNullableString(source: Json, key: string, what: string): string | null {
  return source[key] === null ? null : readString(source, key, what);
}

/** Champ optionnel côté API (absent du JSON, jamais `null`, quand Nest sérialise une valeur `undefined`). */
export function readOptionalString(source: Json, key: string, what: string): string | undefined {
  const value = source[key];
  if (value === undefined) return undefined;
  return readString(source, key, what);
}

export function readBoolean(source: Json, key: string, what: string): boolean {
  const value = source[key];
  if (typeof value !== "boolean") throw invalidResponse(`${what}.${key}`, value);
  return value;
}

export function readNumber(source: Json, key: string, what: string): number {
  const value = source[key];
  if (typeof value !== "number" || !Number.isFinite(value)) throw invalidResponse(`${what}.${key}`, value);
  return value;
}

export function readStringArray(source: Json, key: string, what: string): string[] {
  const value = source[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw invalidResponse(`${what}.${key}`, value);
  }
  return value as string[];
}
