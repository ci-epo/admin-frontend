"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Alert from "@/components/ui/alert/Alert";
import Modal from "@/components/ui/modal/Modal";
import MediaFormFields from "@/components/sections/admin/media/MediaFormFields";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import { MEDIA_FILE_KINDS, MEDIA_MAX_BYTES, mimeTypeFor } from "@/lib/schemas/media.schema";
import { formatBytes } from "@/lib/utils/format-bytes";
import { mediaMessage } from "@/lib/utils/media-messages";
import { uploadFile, type UploadResult } from "@/lib/utils/upload-client";
import type { MediaKind } from "@/types/media";

interface MediaUploadModalProps {
  kind: MediaKind;
  isOpen: boolean;
  onClose: () => void;
}

const NOUN: Record<MediaKind, string> = { PHOTO: "une photo", VIDEO: "une vidéo", DOCUMENT: "un document" };

type Phase = { name: "idle" } | { name: "sending"; label: string; fraction: number } | { name: "done" };

/**
 * Envoi d'un fichier avec ses informations. Le fichier part tel quel vers `/api/media/upload` (flux, avec progression) ;
 * pour une vidéo, l'image d'aperçu facultative est envoyée juste après.
 */
export default function MediaUploadModal({ kind, isOpen, onClose }: MediaUploadModalProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const abort = useRef<AbortController | null>(null);

  const isSending = phase.name === "sending";
  const isDone = phase.name === "done";
  const fieldError = (name: string) => fieldErrors[name];

  /** Envoi ; si la session a expiré (401), on la renouvelle par un rafraîchissement de page, puis on réessaie une fois. */
  async function send(run: () => Promise<UploadResult>): Promise<UploadResult> {
    const first = await run();
    if (first.status !== 401) return first;
    router.refresh();
    await new Promise((resolve) => setTimeout(resolve, 800));
    return run();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("file");
    const poster = form.get("poster");
    setError(null);
    setWarning(null);

    if (!(file instanceof File) || file.size === 0) return setError(`Choisissez ${NOUN[kind]} à envoyer.`);
    const mimeType = mimeTypeFor(kind, file);
    if (!mimeType) return setError(`Format non accepté (${MEDIA_FILE_KINDS[kind].label}).`);
    if (file.size > MEDIA_MAX_BYTES[kind]) {
      return setError(`Fichier trop volumineux : ${formatBytes(file.size)} (maximum ${formatBytes(MEDIA_MAX_BYTES[kind])}).`);
    }
    const posterFile = poster instanceof File && poster.size > 0 ? poster : null;
    const posterType = posterFile ? mimeTypeFor("POSTER", posterFile) : null;
    if (posterFile && (!posterType || posterFile.size > MEDIA_MAX_BYTES.POSTER)) {
      return setError(`Image d'aperçu refusée (${MEDIA_FILE_KINDS.POSTER.label}, ${formatBytes(MEDIA_MAX_BYTES.POSTER)} au plus).`);
    }

    const text = (name: string) => String(form.get(name) ?? "").trim();
    const query = new URLSearchParams({ kind, title: text("title"), originalName: file.name });
    for (const name of ["tag", "caption", "alt", "category", "year"]) if (text(name)) query.set(name, text(name));
    if (kind !== "DOCUMENT") {
      query.set("placement", text("placement") || "BOTH");
      query.set("isPublished", String(form.get("isPublished") === "on"));
    }

    const controller = new AbortController();
    abort.current = controller;
    setPhase({ name: "sending", label: "Envoi du fichier…", fraction: 0 });
    const result = await send(() =>
      uploadFile({
        url: `/api/media/upload?${query.toString()}`,
        method: "POST",
        file,
        contentType: mimeType,
        signal: controller.signal,
        onProgress: (fraction) => setPhase({ name: "sending", label: "Envoi du fichier…", fraction }),
      }),
    );
    if (!result.ok) {
      setPhase({ name: "idle" });
      setFieldErrors(result.apiCode === "MEDIA_TITLE_REQUIRED" ? { title: mediaMessage(result.apiCode) } : {});
      return setError(result.message ?? mediaMessage(result.apiCode, result.status));
    }

    if (posterFile && posterType) {
      const publicId = result.publicId;
      const posterResult = publicId
        ? await send(() =>
            uploadFile({
              url: `/api/media/${encodeURIComponent(publicId)}/poster`,
              method: "PUT",
              file: posterFile,
              contentType: posterType,
              signal: controller.signal,
              onProgress: (fraction) => setPhase({ name: "sending", label: "Envoi de l'aperçu…", fraction }),
            }),
          )
        : null;
      if (!posterResult?.ok) setWarning("La vidéo est enregistrée, mais son image d'aperçu n'a pas pu être envoyée : ajoutez-la en modifiant la vidéo.");
    }

    setPhase({ name: "done" });
    router.refresh();
  }

  function handleClose() {
    abort.current?.abort();
    setPhase({ name: "idle" });
    setError(null);
    setWarning(null);
    setFieldErrors({});
    onClose();
  }

  const percent = phase.name === "sending" ? Math.round(phase.fraction * 100) : 0;

  return (
    <Modal title={`Ajouter ${NOUN[kind]}`} isOpen={isOpen} onClose={handleClose} dialog={{ centered: true, scrollable: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        {error && <Alert variant="danger" icon="ri-error-warning-line" message={error} className="mb-3" />}
        {isDone && (
          <Alert
            variant={warning ? "warning" : "success"}
            icon={warning ? "ri-alert-line" : "ri-checkbox-circle-line"}
            message={warning ?? "Envoyé."}
            className="mb-3"
          />
        )}
        {!isDone && (
          <>
            <div className="mb-3">
              <label className="form-label" htmlFor={`upload-${kind}-file`}>
                Fichier
              </label>
              <input
                id={`upload-${kind}-file`}
                name="file"
                type="file"
                className="form-control"
                accept={MEDIA_FILE_KINDS[kind].accept}
                disabled={isSending}
                required
              />
              <div className="form-text">
                {MEDIA_FILE_KINDS[kind].label} · {formatBytes(MEDIA_MAX_BYTES[kind])} au plus
              </div>
            </div>
            <MediaFormFields kind={kind} idPrefix={`upload-${kind}`} fieldError={fieldError} />
            {kind === "VIDEO" && (
              <div className="mt-3">
                <label className="form-label" htmlFor="upload-VIDEO-poster">
                  Image d&apos;aperçu (facultative)
                </label>
                <input
                  id="upload-VIDEO-poster"
                  name="poster"
                  type="file"
                  className="form-control"
                  accept={MEDIA_FILE_KINDS.POSTER.accept}
                  disabled={isSending}
                />
                <div className="form-text">Affichée avant la lecture. {formatBytes(MEDIA_MAX_BYTES.POSTER)} au plus.</div>
              </div>
            )}
            {isSending && (
              <div className="mt-3" role="status" aria-live="polite">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>{phase.label}</span>
                  <span>{percent} %</span>
                </div>
                <div className="progress" style={{ height: 8 }}>
                  <div className="progress-bar" style={{ width: `${percent}%` }} />
                </div>
                <div className="form-text">Ne fermez pas la page pendant l&apos;envoi.</div>
              </div>
            )}
          </>
        )}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-light" onClick={handleClose}>
            {isDone ? "Fermer" : "Annuler"}
          </button>
          {!isDone && <SubmitButton label="Envoyer" pendingLabel="Envoi…" icon="ri-upload-2-line" isPending={isSending} />}
        </div>
      </form>
    </Modal>
  );
}
