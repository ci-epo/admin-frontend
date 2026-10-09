"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";
import type { MemberRow } from "@/types/member";

interface DeleteMemberDialogProps {
  member: MemberRow;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteMemberDialog({ member, action, isOpen, onClose }: DeleteMemberDialogProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);

  return (
    <Modal title="Supprimer ce membre ?" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <input type="hidden" name="publicId" value={member.publicId} />
        <FormFeedback state={state} />
        <p>
          <strong>
            {member.firstName} {member.name}
          </strong>{" "}
          sera définitivement retiré des membres. Impossible s&apos;il occupe encore un poste au bureau.
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
