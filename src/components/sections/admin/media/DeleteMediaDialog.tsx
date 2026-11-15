"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";
import type { MediaRow } from "@/types/media";

interface DeleteMediaDialogProps {
  media: MediaRow;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

const NOUN = { PHOTO: "cette photo", VIDEO: "cette vidéo", DOCUMENT: "ce document" } as const;

export default function DeleteMediaDialog({ media, action, isOpen, onClose }: DeleteMediaDialogProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const isDone = state.status === "success";

  return (
    <Modal title={`Supprimer ${NOUN[media.kind]} ?`} isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <input type="hidden" name="publicId" value={media.publicId} />
        <FormFeedback state={state} />
        {!isDone && (
          <p>
            <strong>{media.title}</strong> et son fichier seront définitivement supprimés
            {media.kind !== "DOCUMENT" ? ", et ne s'afficheront plus sur le site" : ""}.
          </p>
        )}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={isPending}>
            {isDone ? "Fermer" : "Annuler"}
          </button>
          {!isDone && (
            <SubmitButton
              label="Supprimer"
              pendingLabel="Suppression…"
              icon="ri-delete-bin-line"
              variant="danger"
              isPending={isPending}
            />
          )}
        </div>
      </form>
    </Modal>
  );
}
