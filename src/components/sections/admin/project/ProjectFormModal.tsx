"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Input from "@/components/ui/form/input/Input";
import Textarea from "@/components/ui/form/textarea/Textarea";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";
import type { ProjectRow, TagRow } from "@/types/project";

interface ProjectFormModalProps {
  /** Absent : ajout. Présent : modification de ce projet. */
  project?: ProjectRow;
  /** Catalogue des tags, proposés en cases à cocher. */
  tags: TagRow[];
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectFormModal({ project, tags, action, isOpen, onClose }: ProjectFormModalProps) {
  const selectedTagIds = new Set(project?.tags.map((tag) => tag.publicId) ?? []);
  const { state, isPending, handleSubmit } = useActionForm(action);
  const isDone = state.status === "success";
  const fieldError = (name: string) => (state.status === "error" ? state.fieldErrors?.[name] : undefined);
  const idPrefix = project ? "project-edit" : "project-add";

  return (
    <Modal
      title={project ? "Modifier le projet" : "Ajouter un projet"}
      isOpen={isOpen}
      onClose={onClose}
      dialog={{ centered: true }}
    >
      <form onSubmit={handleSubmit} className="text-start">
        {project && <input type="hidden" name="publicId" value={project.publicId} />}
        <FormFeedback state={state} />
        {!isDone && (
          <>
            <Input
              id={`${idPrefix}-title`}
              name="title"
              label="Titre"
              defaultValue={project?.title}
              error={fieldError("title")}
              wrapperClass="mb-3"
              required
            />
            <Textarea
              id={`${idPrefix}-description`}
              name="description"
              label="Description"
              defaultValue={project?.description}
              rows={3}
              wrapperClass="mb-3"
              required
            />
            {fieldError("description") && <div className="invalid-feedback d-block">{fieldError("description")}</div>}
            <Input
              id={`${idPrefix}-github`}
              name="githubUrl"
              type="url"
              label="Lien GitHub"
              defaultValue={project?.githubUrl}
              error={fieldError("githubUrl")}
              wrapperClass="mb-3"
              required
            />
            <Input
              id={`${idPrefix}-address`}
              name="addressUrl"
              type="url"
              label="Lien de démonstration"
              defaultValue={project?.addressUrl}
              error={fieldError("addressUrl")}
              wrapperClass="mb-3"
              required
            />
            <fieldset className="mb-3">
              <legend className="fs-6 mb-2">Tags</legend>
              {tags.length === 0 && (
                <p className="text-muted small mb-0">Aucun tag pour le moment : créez-en dans la section Tags.</p>
              )}
              {tags.map((tag) => (
                <div key={tag.publicId} className="form-check form-check-inline">
                  <input
                    id={`${idPrefix}-tag-${tag.publicId}`}
                    type="checkbox"
                    name="tag"
                    value={tag.publicId}
                    className="form-check-input"
                    defaultChecked={selectedTagIds.has(tag.publicId)}
                  />
                  <label className="form-check-label" htmlFor={`${idPrefix}-tag-${tag.publicId}`}>
                    {tag.name}
                  </label>
                </div>
              ))}
            </fieldset>
            <div className="form-check">
              <input
                id={`${idPrefix}-public`}
                type="checkbox"
                name="isPublic"
                className="form-check-input"
                defaultChecked={project?.isPublic ?? false}
              />
              <label className="form-check-label" htmlFor={`${idPrefix}-public`}>
                Visible sur le site public
              </label>
            </div>
          </>
        )}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={isPending}>
            {isDone ? "Fermer" : "Annuler"}
          </button>
          {!isDone && (
            <SubmitButton
              label={project ? "Enregistrer" : "Ajouter"}
              pendingLabel={project ? "Enregistrement…" : "Ajout…"}
              icon={project ? undefined : "ri-add-line"}
              isPending={isPending}
            />
          )}
        </div>
      </form>
    </Modal>
  );
}
