"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";
import type { ProjectRow } from "@/types/project";

interface DeleteProjectDialogProps {
  project: ProjectRow;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteProjectDialog({ project, action, isOpen, onClose }: DeleteProjectDialogProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);

  return (
    <Modal title="Supprimer ce projet ?" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <input type="hidden" name="publicId" value={project.publicId} />
        <FormFeedback state={state} />
        <p>
          <strong>{project.title}</strong> sera définitivement supprimé.
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
