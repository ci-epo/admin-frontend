/**
 * Seul endroit qui lit `process.env`. Accès littéraux uniquement : Next.js n'inline une variable `NEXT_PUBLIC_*`
 * dans le code navigateur que sous la forme `process.env.NEXT_PUBLIC_…` (un accès `process.env[name]` resterait vide).
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  apiBaseUrl: required("NEXT_PUBLIC_API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL),
} as const;

/**
 * URL de l'API pour un appel. Côté serveur (actions, layouts, Route Handlers), l'adresse interne quand elle existe :
 * dans Docker, `http://api:3000/api` (l'URL publique `localhost:3000` désignerait le conteneur lui-même).
 */
export function apiBaseUrl(): string {
  const internal = typeof window === "undefined" ? process.env.API_INTERNAL_BASE_URL : undefined;
  return internal || env.apiBaseUrl;
}

/** Cookies `Secure` (HTTPS obligatoire) en production uniquement. */
export const isProduction = process.env.NODE_ENV === "production";
