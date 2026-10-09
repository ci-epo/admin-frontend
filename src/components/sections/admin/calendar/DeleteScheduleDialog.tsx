"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import { formatDate } from "@/lib/utils/format-date";
import type { FormAction } from "@/types/administration";
import type { Schedule } from "@/types/calendar";

interface DeleteScheduleDialogProps {
  schedule: Schedule;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteScheduleDialog({ schedule, action, isOpen, onClose }: DeleteScheduleDialogProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);

  return (
    <Modal title="Supprimer ce créneau ?" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <input type="hidden" name="publicId" value={schedule.publicId} />
        <FormFeedback state={state} />
        <p>
          <strong>{schedule.localisation}</strong> ({formatDate(new Date(schedule.date))}, {schedule.beginHour}–
          {schedule.endHour}) sera définitivement supprimé. Impossible s&apos;il est encore utilisé par une activité.
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
