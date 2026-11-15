export interface UploadResult {
  ok: boolean;
  status: number;
  /** Code métier d'app-service (`MEDIA_TOO_LARGE`…), quand il y en a un. */
  apiCode?: string;
  message?: string;
  /** Identifiant de la fiche créée, quand l'API le renvoie. */
  publicId?: string;
}

interface UploadOptions {
  url: string;
  method: "POST" | "PUT";
  file: File;
  contentType: string;
  /** Progression de l'envoi, de 0 à 1. */
  onProgress?: (fraction: number) => void;
  signal?: AbortSignal;
}

/**
 * Envoie un fichier brut avec suivi de progression (`fetch` n'en offre pas pour l'envoi). Ne lève jamais : un échec
 * réseau ou une annulation donnent `status: 0`.
 */
export function uploadFile({ url, method, file, contentType, onProgress, signal }: UploadOptions): Promise<UploadResult> {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.open(method, url);
    request.setRequestHeader("Content-Type", contentType);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(event.loaded / event.total);
    };
    request.onload = () => {
      const payload = parseJson(request.responseText);
      resolve({ ok: request.status >= 200 && request.status < 300, status: request.status, ...payload });
    };
    request.onerror = () => resolve({ ok: false, status: 0 });
    request.onabort = () => resolve({ ok: false, status: 0, message: "Envoi annulé." });
    signal?.addEventListener("abort", () => request.abort(), { once: true });
    request.send(file);
  });
}

function parseJson(text: string): { apiCode?: string; message?: string; publicId?: string } {
  try {
    const value = JSON.parse(text) as { apiCode?: unknown; message?: unknown; publicId?: unknown };
    return {
      publicId: typeof value.publicId === "string" ? value.publicId : undefined,
      apiCode: typeof value.apiCode === "string" ? value.apiCode : undefined,
      message: typeof value.message === "string" ? value.message : undefined,
    };
  } catch {
    return {};
  }
}
