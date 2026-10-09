"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import ActivityFormFields from "@/components/sections/admin/activity/ActivityFormFields";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";
import type { ActivityFormOptions, ActivityRow } from "@/types/activity";

interface EditActivityModalProps {
  activity: ActivityRow;
  options: ActivityFormOptions;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditActivityModal({ activity, options, action, isOpen, onClose }: EditActivityModalProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const isDone = state.status === "success";
  const fieldError = (name: string) => (state.status === "error" ? state.fieldErrors?.[name] : undefined);

  return (
    <Modal title="Modifier l'activité" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <input type="hidden" name="publicId" value={activity.publicId} />
        <FormFeedback state={state} />
        {!isDone && (
          <ActivityFormFields
            options={options}
            fieldError={fieldError}
            idPrefix="activity-edit"
            defaults={{
              name: activity.name,
              type: activity.type,
              description: activity.description ?? "",
              mandateId: activity.mandateId,
              trainerId: activity.trainerId,
              scheduleId: activity.scheduleId,
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
