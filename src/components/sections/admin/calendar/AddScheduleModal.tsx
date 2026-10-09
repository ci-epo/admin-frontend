"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import ScheduleFormFields from "@/components/sections/admin/calendar/ScheduleFormFields";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";

interface AddScheduleModalProps {
  action: FormAction;
  /** Date pré-remplie (`YYYY-MM-DD`) quand la modale est ouverte depuis un clic sur une case du calendrier. */
  initialDate?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddScheduleModal({ action, initialDate, isOpen, onClose }: AddScheduleModalProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const isDone = state.status === "success";
  const fieldError = (name: string) => (state.status === "error" ? state.fieldErrors?.[name] : undefined);

  return (
    <Modal title="Ajouter un créneau" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <FormFeedback state={state} />
        {!isDone && (
          <ScheduleFormFields
            fieldError={fieldError}
            idPrefix="schedule-add"
            defaults={{ date: initialDate ?? "", beginHour: "", endHour: "", localisation: "" }}
          />
        )}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={isPending}>
            {isDone ? "Fermer" : "Annuler"}
          </button>
          {!isDone && <SubmitButton label="Ajouter" pendingLabel="Ajout…" icon="ri-add-line" isPending={isPending} />}
        </div>
      </form>
    </Modal>
  );
}
