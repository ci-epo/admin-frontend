"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Input from "@/components/ui/form/input/Input";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";
import type { MemberRow } from "@/types/member";

interface EditMemberModalProps {
  member: MemberRow;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditMemberModal({ member, action, isOpen, onClose }: EditMemberModalProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const isDone = state.status === "success";
  const fieldError = (name: string) => (state.status === "error" ? state.fieldErrors?.[name] : undefined);

  return (
    <Modal title="Modifier le membre" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <input type="hidden" name="publicId" value={member.publicId} />
        <FormFeedback state={state} />
        {!isDone && (
          <>
            <div className="row">
              <div className="col-6">
                <Input
                  id="member-edit-first-name"
                  name="firstName"
                  label="Prénom"
                  defaultValue={member.firstName}
                  error={fieldError("firstName")}
                  wrapperClass="mb-3"
                  required
                />
              </div>
              <div className="col-6">
                <Input
                  id="member-edit-name"
                  name="name"
                  label="Nom"
                  defaultValue={member.name}
                  error={fieldError("name")}
                  wrapperClass="mb-3"
                  required
                />
              </div>
            </div>
            <Input
              id="member-edit-phone"
              name="phoneNumber"
              label="Téléphone"
              defaultValue={member.phoneNumber}
              error={fieldError("phoneNumber")}
              wrapperClass="mb-3"
              required
            />
            <Input
              id="member-edit-email"
              name="email"
              type="email"
              label="E-mail"
              defaultValue={member.email}
              error={fieldError("email")}
              wrapperClass="mb-3"
              required
            />
            <div className="mb-3">
              <label htmlFor="member-edit-type" className="form-label">
                Type
              </label>
              <select id="member-edit-type" name="type" className="form-select" defaultValue={member.type}>
                <option value="MEMBER">Membre</option>
                <option value="PARTNER">Partenaire</option>
              </select>
            </div>
          </>
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
