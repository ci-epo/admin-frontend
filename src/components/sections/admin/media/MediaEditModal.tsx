"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import MediaFormFields from "@/components/sections/admin/media/MediaFormFields";
import Alert from "@/components/ui/alert/Alert";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import { MEDIA_FILE_KINDS, MEDIA_MAX_BYTES, mimeTypeFor } from "@/lib/schemas/media.schema";
import { formatBytes } from "@/lib/utils/format-bytes";
import { mediaMessage } from "@/lib/utils/media-messages";
import { uploadFile } from "@/lib/utils/upload-client";
import type { FormAction } from "@/types/administration";
import type { MediaRow } from "@/types/media";

interface MediaEditModalProps {
  media: MediaRow;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function MediaEditModal({ media, action, isOpen, onClose }: MediaEditModalProps) {
  const router = useRouter();
  const { state, isPending, handleSubmit } = useActionForm(action);
  const fieldError = (name: string) => (state.status === "error" ? state.fieldErrors?.[name] : undefined);
  const isDone = state.status === "success";
  const posterInput = useRef<HTMLInputElement>(null);
  const [posterStatus, setPosterStatus] = useState<{ tone: "success" | "danger"; message: string } | null>(null);
  const [isPosterSending, setIsPosterSending] = useState(false);

  async function sendPoster() {
    const file = posterInput.current?.files?.[0];
    if (!file) return setPosterStatus({ tone: "danger", message: "Choisissez une image." });
    const mimeType = mimeTypeFor("POSTER", file);
    if (!mimeType) return setPosterStatus({ tone: "danger", message: `Format non accepté (${MEDIA_FILE_KINDS.POSTER.label}).` });
    if (file.size > MEDIA_MAX_BYTES.POSTER) {
      return setPosterStatus({ tone: "danger", message: `Image trop lourde (${formatBytes(MEDIA_MAX_BYTES.POSTER)} au plus).` });
    }

    setIsPosterSending(true);
    setPosterStatus(null);
    const result = await uploadFile({
      url: `/api/media/${encodeURIComponent(media.publicId)}/poster`,
      method: "PUT",
      file,
      contentType: mimeType,
    });
    setIsPosterSending(false);
    if (!result.ok) {
      return setPosterStatus({ tone: "danger", message: result.message ?? mediaMessage(result.apiCode, result.status) });
    }
    setPosterStatus({ tone: "success", message: "Image d'aperçu enregistrée." });
    router.refresh();
  }

  return (
    <Modal title="Modifier" isOpen={isOpen} onClose={onClose} dialog={{ centered: true, scrollable: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <input type="hidden" name="publicId" value={media.publicId} />
        <input type="hidden" name="kind" value={media.kind} />
        <FormFeedback state={state} />
        {!isDone && <MediaFormFields kind={media.kind} media={media} idPrefix={`edit-${media.publicId}`} fieldError={fieldError} />}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={isPending}>
            {isDone ? "Fermer" : "Annuler"}
          </button>
          {!isDone && <SubmitButton label="Enregistrer" pendingLabel="Enregistrement…" isPending={isPending} />}
        </div>
      </form>

      {media.kind === "VIDEO" && !isDone && (
        <section className="border-top mt-4 pt-3 text-start" aria-label="Image d'aperçu">
          <h6 className="mb-2">Image d&apos;aperçu</h6>
          {media.hasPoster && (
            // eslint-disable-next-line @next/next/no-img-element -- aperçu servi par la route authentifiée de l'admin
            <img
              src={`/api/media/${encodeURIComponent(media.publicId)}/poster`}
              alt="Aperçu actuel de la vidéo"
              className="img-fluid rounded mb-2"
              style={{ maxHeight: 140 }}
            />
          )}
          {posterStatus && (
            <Alert
              variant={posterStatus.tone}
              icon={posterStatus.tone === "success" ? "ri-checkbox-circle-line" : "ri-error-warning-line"}
              message={posterStatus.message}
              className="mb-2"
            />
          )}
          <div className="input-group">
            <input
              ref={posterInput}
              type="file"
              className="form-control"
              accept={MEDIA_FILE_KINDS.POSTER.accept}
              aria-label="Nouvelle image d'aperçu"
              disabled={isPosterSending}
            />
            <button type="button" className="btn btn-outline-primary" onClick={sendPoster} disabled={isPosterSending}>
              {isPosterSending ? "Envoi…" : media.hasPoster ? "Remplacer" : "Envoyer"}
            </button>
          </div>
        </section>
      )}
    </Modal>
  );
}
