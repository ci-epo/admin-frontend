"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import ScheduleFormFields from "@/components/sections/admin/calendar/ScheduleFormFields";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";
import type { Schedule } from "@/types/calendar";

interface EditScheduleModalProps {
  schedule: Schedule;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditScheduleModal({ schedule, action, isOpen, onClose }: EditScheduleModalProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const isDone = state.status === "success";
  const fieldError = (name: string) => (state.status === "error" ? state.fieldErrors?.[name] : undefined);

  return (
    <Modal title="Modifier le créneau" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <input type="hidden" name="publicId" value={schedule.publicId} />
        <FormFeedback state={state} />
        {!isDone && (
          <ScheduleFormFields
            fieldError={fieldError}
            idPrefix="schedule-edit"
            defaults={{
              // `date` est minuit UTC (club à UTC+0 sans heure d'été) : les 10 premiers caractères donnent YYYY-MM-DD.
              date: schedule.date.slice(0, 10),
              beginHour: schedule.beginHour,
              endHour: schedule.endHour,
              localisation: schedule.localisation,
            }}
          />
        )}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={isPending}>
            {isDone ? "Fermer" : "Annuler"}
          </button>
          {!isDone && (
            <SubmitButton label="Enregistrer" pendingLabel="Enregistrement…" icon="ri-save-3-line" isPending={isPending} />
          )}
        </div>
      </form>
    </Modal>
  );
}
