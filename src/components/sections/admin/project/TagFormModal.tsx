"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Input from "@/components/ui/form/input/Input";
import Textarea from "@/components/ui/form/textarea/Textarea";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";
import type { TagRow } from "@/types/project";

interface TagFormModalProps {
  /** Absent : ajout. Présent : modification de ce tag. */
  tag?: TagRow;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function TagFormModal({ tag, action, isOpen, onClose }: TagFormModalProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const isDone = state.status === "success";
  const fieldError = (name: string) => (state.status === "error" ? state.fieldErrors?.[name] : undefined);
  const idPrefix = tag ? "tag-edit" : "tag-add";

  return (
    <Modal
      title={tag ? "Modifier le tag" : "Ajouter un tag"}
      isOpen={isOpen}
      onClose={onClose}
      dialog={{ centered: true }}
    >
      <form onSubmit={handleSubmit} className="text-start">
        {tag && <input type="hidden" name="publicId" value={tag.publicId} />}
        <FormFeedback state={state} />
        {!isDone && (
          <>
            <Input
              id={`${idPrefix}-name`}
              name="name"
              label="Nom"
              defaultValue={tag?.name}
              error={fieldError("name")}
              wrapperClass="mb-3"
              required
            />
            <Textarea
              id={`${idPrefix}-description`}
              name="description"
              label="Description"
              defaultValue={tag?.description}
              rows={2}
              wrapperClass="mb-3"
              required
            />
            {fieldError("description") && <div className="invalid-feedback d-block">{fieldError("description")}</div>}
          </>
        )}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={isPending}>
            {isDone ? "Fermer" : "Annuler"}
          </button>
          {!isDone && (
            <SubmitButton
              label={tag ? "Enregistrer" : "Ajouter"}
              pendingLabel={tag ? "Enregistrement…" : "Ajout…"}
              icon={tag ? undefined : "ri-add-line"}
              isPending={isPending}
            />
          )}
        </div>
      </form>
    </Modal>
  );
}
