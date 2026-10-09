"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import ActivityFormFields from "@/components/sections/admin/activity/ActivityFormFields";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";
import type { ActivityFormOptions } from "@/types/activity";

interface AddActivityModalProps {
  options: ActivityFormOptions;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddActivityModal({ options, action, isOpen, onClose }: AddActivityModalProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const isDone = state.status === "success";
  const fieldError = (name: string) => (state.status === "error" ? state.fieldErrors?.[name] : undefined);
  const noOptions = options.mandates.length === 0 || options.trainers.length === 0 || options.schedules.length === 0;

  return (
    <Modal title="Ajouter une activité" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <FormFeedback state={state} />
        {!isDone && noOptions && (
          <p className="text-muted">
            Il faut au moins un mandat, un membre et un créneau enregistrés avant de pouvoir créer une activité.
          </p>
        )}
        {!isDone && !noOptions && (
          <ActivityFormFields options={options} fieldError={fieldError} idPrefix="activity-add" />
        )}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={isPending}>
            {isDone ? "Fermer" : "Annuler"}
          </button>
          {!isDone && !noOptions && (
            <SubmitButton label="Ajouter" pendingLabel="Ajout…" icon="ri-add-line" isPending={isPending} />
          )}
        </div>
      </form>
    </Modal>
  );
}
