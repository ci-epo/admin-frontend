"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Input from "@/components/ui/form/input/Input";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";
import type { OfficeAssignmentFormOptions } from "@/types/office-assignment";

interface AddOfficeAssignmentModalProps {
  options: OfficeAssignmentFormOptions;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddOfficeAssignmentModal({ options, action, isOpen, onClose }: AddOfficeAssignmentModalProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const isDone = state.status === "success";
  const fieldError = (name: string) => (state.status === "error" ? state.fieldErrors?.[name] : undefined);
  const noOptions = options.members.length === 0 || options.positions.length === 0 || options.mandates.length === 0;

  return (
    <Modal title="Ajouter au bureau" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <FormFeedback state={state} />
        {!isDone && noOptions && (
          <p className="text-muted">
            Il faut au moins un membre, un poste et un mandat enregistrés avant de pouvoir affecter quelqu&apos;un au bureau.
          </p>
        )}
        {!isDone && !noOptions && (
          <>
            <div className="mb-3">
              <label htmlFor="office-assignment-member" className="form-label">
                Membre
              </label>
              <select
                id="office-assignment-member"
                name="memberId"
                className={`form-select${fieldError("memberId") ? " is-invalid" : ""}`}
                defaultValue=""
              >
                <option value="" disabled>
                  Choisir un membre
                </option>
                {options.members.map((member) => (
                  <option key={member.publicId} value={member.publicId}>
                    {member.label}
                  </option>
                ))}
              </select>
              {fieldError("memberId") && <div className="invalid-feedback d-block">{fieldError("memberId")}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="office-assignment-position" className="form-label">
                Poste
              </label>
              <select
                id="office-assignment-position"
                name="positionId"
                className={`form-select${fieldError("positionId") ? " is-invalid" : ""}`}
                defaultValue=""
              >
                <option value="" disabled>
                  Choisir un poste
                </option>
                {options.positions.map((position) => (
                  <option key={position.publicId} value={position.publicId}>
                    {position.label}
                  </option>
                ))}
              </select>
              {fieldError("positionId") && <div className="invalid-feedback d-block">{fieldError("positionId")}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="office-assignment-mandate" className="form-label">
                Mandat
              </label>
              <select
                id="office-assignment-mandate"
                name="mandateId"
                className={`form-select${fieldError("mandateId") ? " is-invalid" : ""}`}
                defaultValue=""
              >
                <option value="" disabled>
                  Choisir un mandat
                </option>
                {options.mandates.map((mandate) => (
                  <option key={mandate.publicId} value={mandate.publicId}>
                    {mandate.label}
                  </option>
                ))}
              </select>
              {fieldError("mandateId") && <div className="invalid-feedback d-block">{fieldError("mandateId")}</div>}
            </div>

            <div className="row">
              <div className="col-6">
                <Input
                  id="office-assignment-begin"
                  name="beginDate"
                  type="date"
                  label="Début"
                  error={fieldError("beginDate")}
                />
              </div>
              <div className="col-6">
                <Input
                  id="office-assignment-end"
                  name="endDate"
                  type="date"
                  label="Fin"
                  error={fieldError("endDate")}
                />
              </div>
            </div>
          </>
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
