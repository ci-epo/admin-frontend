"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Input from "@/components/ui/form/input/Input";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";

interface AddMemberModalProps {
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMemberModal({ action, isOpen, onClose }: AddMemberModalProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const isDone = state.status === "success";
  const fieldError = (name: string) => (state.status === "error" ? state.fieldErrors?.[name] : undefined);

  return (
    <Modal title="Ajouter un membre" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <FormFeedback state={state} />
        {!isDone && (
          <>
            <div className="row">
              <div className="col-6">
                <Input
                  id="member-add-first-name"
                  name="firstName"
                  label="Prénom"
                  error={fieldError("firstName")}
                  wrapperClass="mb-3"
                  required
                />
              </div>
              <div className="col-6">
                <Input
                  id="member-add-name"
                  name="name"
                  label="Nom"
                  error={fieldError("name")}
                  wrapperClass="mb-3"
                  required
                />
              </div>
            </div>
            <Input
              id="member-add-phone"
              name="phoneNumber"
              label="Téléphone"
              error={fieldError("phoneNumber")}
              wrapperClass="mb-3"
              required
            />
            <Input
              id="member-add-email"
              name="email"
              type="email"
              label="E-mail"
              error={fieldError("email")}
              wrapperClass="mb-3"
              required
            />
            <Input
              id="member-add-password"
              name="password"
              type="password"
              label="Mot de passe (facultatif)"
              autoComplete="new-password"
              error={fieldError("password")}
              placeholder="Laisser vide : pas de compte de connexion"
              wrapperClass="mb-3"
            />
            <div className="mb-3">
              <label htmlFor="member-add-type" className="form-label">
                Type
              </label>
              <select id="member-add-type" name="type" className="form-select" defaultValue="MEMBER">
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
          {!isDone && <SubmitButton label="Ajouter" pendingLabel="Ajout…" icon="ri-add-line" isPending={isPending} />}
        </div>
      </form>
    </Modal>
  );
}
