"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";
import type { TagRow } from "@/types/project";

interface DeleteTagDialogProps {
  tag: TagRow;
  /** Nombre de projets qui portent ce tag (retirés avec lui). */
  projectCount: number;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteTagDialog({ tag, projectCount, action, isOpen, onClose }: DeleteTagDialogProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);

  return (
    <Modal title="Supprimer ce tag ?" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <input type="hidden" name="publicId" value={tag.publicId} />
        <FormFeedback state={state} />
        <p>
          <strong>{tag.name}</strong> sera supprimé
          {projectCount > 0
            ? ` et retiré de ${projectCount} projet${projectCount > 1 ? "s" : ""}.`
            : " (il n'est rattaché à aucun projet)."}
        </p>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={isPending}>
            Annuler
          </button>
          <SubmitButton
            label="Supprimer"
            pendingLabel="Suppression…"
            icon="ri-delete-bin-line"
            variant="danger"
            isPending={isPending}
          />
        </div>
      </form>
    </Modal>
  );
}
