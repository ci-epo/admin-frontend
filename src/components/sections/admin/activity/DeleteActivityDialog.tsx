"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";
import type { ActivityRow } from "@/types/activity";

interface DeleteActivityDialogProps {
  activity: ActivityRow;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteActivityDialog({ activity, action, isOpen, onClose }: DeleteActivityDialogProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);

  return (
    <Modal title="Supprimer cette activité ?" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <input type="hidden" name="publicId" value={activity.publicId} />
        <FormFeedback state={state} />
        <p>
          <strong>{activity.name}</strong> sera définitivement supprimée.
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
