export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PAYLOAD_TOO_LARGE"
  | "UNPROCESSABLE_ENTITY"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export type ApiError = {
  status: number;
  code: ApiErrorCode;
  /** Code métier renvoyé par app-service (`BACKUP_NOT_FOUND`…), quand il y en a un. */
  apiCode?: string;
  message: string;
  details?: unknown;
};

export type ApiClientRequest = {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

/** Requête dont le corps (fichier) est transmis tel quel, et dont la réponse n'est pas lue. */
export type ApiRawRequest = Omit<ApiClientRequest, "body"> & {
  body?: Blob;
};
