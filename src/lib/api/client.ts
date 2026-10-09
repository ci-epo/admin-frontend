import { apiBaseUrl } from "@/config/env";
import { readAccessToken } from "@/lib/auth/session";
import type { ApiClientRequest, ApiError, ApiErrorCode, ApiRawRequest } from "@/types/api";

function mapStatusToCode(status: number): ApiErrorCode {
  if (status === 400) return "BAD_REQUEST";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status === 413) return "PAYLOAD_TOO_LARGE";
  if (status === 422) return "UNPROCESSABLE_ENTITY";
  if (status === 429) return "RATE_LIMITED";
  if (status === 503) return "SERVICE_UNAVAILABLE";
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN_ERROR";
}

function normalizeApiError(params: {
  status: number;
  code?: ApiErrorCode;
  message: string;
  details?: unknown;
}): ApiError {
  const apiCode = (params.details as { code?: unknown } | null | undefined)?.code;
  return {
    status: params.status,
    code: params.code ?? mapStatusToCode(params.status),
    apiCode: typeof apiCode === "string" ? apiCode : undefined,
    message: params.message,
    details: params.details,
  };
}

/** `new URL("/members", "http://h/api")` perdrait `/api` : on concatène. */
function buildUrl(path: string): string {
  return `${apiBaseUrl().replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function isJsonResponse(response: Response): boolean {
  return (response.headers.get("content-type") ?? "").includes("application/json");
}

/**
 * Jeton de la session connectée, envoyé à tous les appels d'`app-service` : les routes d'administration exigent un compte
 * bureau (`AuthGuard`/`PermissionsGuard`). Hors requête Next.js (tests, pré-rendu), il n'y a pas de cookie : aucun en-tête.
 */
async function sessionAuthorization(): Promise<Record<string, string>> {
  try {
    const token = await readAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

async function send(request: ApiClientRequest | ApiRawRequest, init: RequestInit): Promise<Response> {
  try {
    return await fetch(buildUrl(request.path), {
      method: request.method,
      signal: request.signal,
      cache: request.cache,
      next: request.next,
      ...init,
      // Un en-tête explicite (ex. jeton passé par l'appelant) l'emporte sur celui de la session.
      headers: { ...(await sessionAuthorization()), ...(init.headers as Record<string, string> | undefined) },
    });
  } catch (error) {
    throw normalizeApiError({
      status: 0,
      code: "NETWORK_ERROR",
      message: "Network error while calling API",
      details: error,
    });
  }
}

async function failureOf(response: Response): Promise<ApiError> {
  const payload = isJsonResponse(response) ? await response.json().catch(() => null) : null;
  return normalizeApiError({
    status: response.status,
    message: (payload as { message?: string } | null)?.message ?? `Request failed with status ${response.status}`,
    details: payload,
  });
}

export async function apiClient<TResponse>(request: ApiClientRequest): Promise<TResponse> {
  const response = await send(request, {
    headers: { "Content-Type": "application/json", ...request.headers },
    body: request.body === undefined ? undefined : JSON.stringify(request.body),
  });
  if (!response.ok) {
    throw await failureOf(response);
  }
  return (isJsonResponse(response) ? await response.json() : null) as TResponse;
}

/** Envoie un corps binaire et/ou renvoie la réponse sans la lire (fichier à relayer). Erreurs normalisées. */
export async function apiRawClient(request: ApiRawRequest): Promise<Response> {
  const response = await send(request, {
    headers: {
      ...(request.body ? { "Content-Type": "application/octet-stream" } : {}),
      ...request.headers,
    },
    body: request.body,
  });
  if (!response.ok) {
    throw await failureOf(response);
  }
  return response;
}

export function isApiError(error: unknown): error is ApiError {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as Partial<ApiError>;
  return (
    typeof candidate.status === "number" && typeof candidate.code === "string" && typeof candidate.message === "string"
  );
}
