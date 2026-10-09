"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Input from "@/components/ui/form/input/Input";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";
import type { OfficeAssignmentFormOptions, OfficeAssignmentRow } from "@/types/office-assignment";

interface EditOfficeAssignmentModalProps {
  row: OfficeAssignmentRow;
  options: OfficeAssignmentFormOptions;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

/** Le membre n'est pas modifiable : changer de personne passe par une nouvelle affectation. */
export default function EditOfficeAssignmentModal({
  row,
  options,
  action,
  isOpen,
  onClose,
}: EditOfficeAssignmentModalProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const isDone = state.status === "success";
  const fieldError = (name: string) => (state.status === "error" ? state.fieldErrors?.[name] : undefined);

  return (
    <Modal title="Modifier l'affectation" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <input type="hidden" name="publicId" value={row.publicId} />
        <FormFeedback state={state} />
        {!isDone && (
          <>
            <p className="mb-3">
              <span className="text-muted">Membre :</span> <strong>{row.memberName}</strong>
            </p>

            <div className="mb-3">
              <label htmlFor="office-assignment-edit-position" className="form-label">
                Poste
              </label>
              <select
                id="office-assignment-edit-position"
                name="positionId"
                className={`form-select${fieldError("positionId") ? " is-invalid" : ""}`}
                defaultValue={row.positionId}
              >
                {options.positions.map((position) => (
                  <option key={position.publicId} value={position.publicId}>
                    {position.label}
                  </option>
                ))}
              </select>
              {fieldError("positionId") && <div className="invalid-feedback d-block">{fieldError("positionId")}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="office-assignment-edit-mandate" className="form-label">
                Mandat
              </label>
              <select
                id="office-assignment-edit-mandate"
                name="mandateId"
                className={`form-select${fieldError("mandateId") ? " is-invalid" : ""}`}
                defaultValue={row.mandateId}
              >
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
                  id="office-assignment-edit-begin"
                  name="beginDate"
                  type="date"
                  label="Début"
                  defaultValue={row.beginDate}
                  error={fieldError("beginDate")}
                />
              </div>
              <div className="col-6">
                <Input
                  id="office-assignment-edit-end"
                  name="endDate"
                  type="date"
                  label="Fin"
                  defaultValue={row.endDate}
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
          {!isDone && <SubmitButton label="Enregistrer" pendingLabel="Enregistrement…" isPending={isPending} />}
        </div>
      </form>
    </Modal>
  );
}
