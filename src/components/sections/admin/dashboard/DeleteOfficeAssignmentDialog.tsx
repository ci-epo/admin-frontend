"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";
import type { OfficeAssignmentRow } from "@/types/office-assignment";

interface DeleteOfficeAssignmentDialogProps {
  row: OfficeAssignmentRow;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteOfficeAssignmentDialog({
  row,
  action,
  isOpen,
  onClose,
}: DeleteOfficeAssignmentDialogProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);

  return (
    <Modal title="Supprimer cette affectation ?" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <input type="hidden" name="publicId" value={row.publicId} />
        <FormFeedback state={state} />
        <p>
          <strong>{row.memberName}</strong> ne sera plus affecté comme <strong>{row.positionName}</strong> (
          {row.mandateLabel}). Son compte repasse à « membre » s&apos;il n&apos;a plus d&apos;autre affectation.
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
