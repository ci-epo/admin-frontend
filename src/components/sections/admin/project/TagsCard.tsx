"use client";

import { useState } from "react";
import DeleteTagDialog from "@/components/sections/admin/project/DeleteTagDialog";
import TagFormModal from "@/components/sections/admin/project/TagFormModal";
import RowActions from "@/components/ui/dropdown/RowActions";
import EmptyState from "@/components/ui/empty-state/EmptyState";
import TableToolbar from "@/components/ui/table/TableToolbar";
import type { FormAction } from "@/types/administration";
import type { ProjectRow, TagRow } from "@/types/project";

interface TagsCardProps {
  tags: TagRow[];
  projects: ProjectRow[];
  createAction: FormAction;
  updateAction: FormAction;
  deleteAction: FormAction;
}

type OpenDialog = { kind: "add" } | { kind: "edit"; tag: TagRow } | { kind: "delete"; tag: TagRow } | null;

/** Catalogue des tags : ajout, modification, suppression. Un tag supprimé est retiré de tous les projets. */
export default function TagsCard({ tags, projects, createAction, updateAction, deleteAction }: TagsCardProps) {
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const close = () => setDialog(null);
  const projectCountOf = (tag: TagRow) =>
    projects.filter((project) => project.tags.some((item) => item.publicId === tag.publicId)).length;

  return (
    <div className="card position-relative z-1">
      <TableToolbar title="Tags" addLabel="Ajouter un tag" onAdd={() => setDialog({ kind: "add" })} size="md" />
      <div className="card-body">
        {tags.length === 0 ? (
          <EmptyState
            className="position-relative z-1"
            icon="ri-price-tag-3-line"
            title="Aucun tag pour le moment"
            description="Les tags servent à classer les projets."
          />
        ) : (
          <div className="table-box table-responsive">
            <table className="table table-hover">
              <thead className="table-light border-0">
                <tr>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Projets</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {tags.map((tag) => (
                  <tr key={tag.publicId}>
                    <td className="fw-semibold">{tag.name}</td>
                    <td className="text-muted">{tag.description}</td>
                    <td>{projectCountOf(tag)}</td>
                    <td className="text-end">
                      <RowActions
                        ariaLabel={`Actions pour le tag ${tag.name}`}
                        actions={[
                          {
                            label: "Modifier",
                            icon: "ri-pencil-line",
                            onClick: () => setDialog({ kind: "edit", tag }),
                          },
                          {
                            label: "Supprimer",
                            icon: "ri-delete-bin-line",
                            onClick: () => setDialog({ kind: "delete", tag }),
                            danger: true,
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {dialog?.kind === "add" && <TagFormModal action={createAction} isOpen onClose={close} />}
      {dialog?.kind === "edit" && <TagFormModal tag={dialog.tag} action={updateAction} isOpen onClose={close} />}
      {dialog?.kind === "delete" && (
        <DeleteTagDialog
          tag={dialog.tag}
          projectCount={projectCountOf(dialog.tag)}
          action={deleteAction}
          isOpen
          onClose={close}
        />
      )}
    </div>
  );
}
