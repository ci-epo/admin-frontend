"use client";

import { useMemo, useState } from "react";
import DeleteProjectDialog from "@/components/sections/admin/project/DeleteProjectDialog";
import ProjectFormModal from "@/components/sections/admin/project/ProjectFormModal";
import RowActions from "@/components/ui/dropdown/RowActions";
import EmptyState from "@/components/ui/empty-state/EmptyState";
import StatusBadge from "@/components/ui/badge/StatusBadge";
import TableFooter from "@/components/ui/table/TableFooter";
import TableToolbar from "@/components/ui/table/TableToolbar";
import { usePagination } from "@/hooks/use-pagination";
import { filterBySearch } from "@/lib/utils/text-search";
import type { FormAction } from "@/types/administration";
import type { ProjectRow, TagRow } from "@/types/project";

interface ProjectBoardProps {
  rows: ProjectRow[];
  tags: TagRow[];
  createAction: FormAction;
  updateAction: FormAction;
  deleteAction: FormAction;
}

const PAGE_SIZE = 10;

/** Champs sur lesquels porte la recherche : titre, description et visibilité affichée. */
function searchableFields(project: ProjectRow): string[] {
  return [
    project.title,
    project.description,
    project.isPublic ? "Public" : "Privé",
    ...project.tags.map((tag) => tag.name),
  ];
}

type OpenDialog =
  { kind: "add" } | { kind: "edit"; project: ProjectRow } | { kind: "delete"; project: ProjectRow } | null;

export default function ProjectBoard({ rows, tags, createAction, updateAction, deleteAction }: ProjectBoardProps) {
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [query, setQuery] = useState("");
  const filteredRows = useMemo(() => filterBySearch(rows, query, searchableFields), [rows, query]);
  const { items, page, totalPages, from, to, total, setPage } = usePagination(filteredRows, PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const close = () => setDialog(null);

  return (
    <div className="card position-relative z-1">
      <TableToolbar
        title="Projets"
        onAdd={() => setDialog({ kind: "add" })}
        searchPlaceholder="Rechercher un projet..."
        searchValue={query}
        onSearchChange={handleSearchChange}
        size="md"
      />
      <div className="card-body">
        {total === 0 ? (
          <EmptyState
            className="position-relative z-1"
            icon="ri-folder-chart-line"
            title={rows.length > 0 ? `Aucun résultat pour « ${query.trim()} »` : "Aucun projet pour le moment"}
            description={rows.length === 0 ? "Ajoutez le premier projet du club." : undefined}
          />
        ) : (
          <>
            <div className="table-box table-responsive">
              <table className="table table-hover">
                <thead className="table-light border-0">
                  <tr>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Visibilité</th>
                    <th>Tags</th>
                    <th>Liens</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((project) => (
                    <tr key={project.publicId}>
                      <td className="fw-semibold">{project.title}</td>
                      <td className="text-muted">{project.description}</td>
                      <td>
                        <StatusBadge
                          label={project.isPublic ? "Public" : "Privé"}
                          tone={project.isPublic ? "success" : "secondary"}
                        />
                      </td>
                      <td>
                        {project.tags.map((tag) => (
                          <span key={tag.publicId} className="badge bg-light text-dark border me-1 mb-1">
                            {tag.name}
                          </span>
                        ))}
                      </td>
                      <td className="text-nowrap">
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="me-2">
                          GitHub
                        </a>
                        <a href={project.addressUrl} target="_blank" rel="noreferrer">
                          Démo
                        </a>
                      </td>
                      <td className="text-end">
                        <RowActions
                          ariaLabel={`Actions pour ${project.title}`}
                          actions={[
                            {
                              label: "Modifier",
                              icon: "ri-pencil-line",
                              onClick: () => setDialog({ kind: "edit", project }),
                            },
                            {
                              label: "Supprimer",
                              icon: "ri-delete-bin-line",
                              onClick: () => setDialog({ kind: "delete", project }),
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
            <TableFooter
              from={from}
              to={to}
              total={total}
              emptyLabel=""
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {dialog?.kind === "add" && <ProjectFormModal tags={tags} action={createAction} isOpen onClose={close} />}
      {dialog?.kind === "edit" && (
        <ProjectFormModal project={dialog.project} tags={tags} action={updateAction} isOpen onClose={close} />
      )}
      {dialog?.kind === "delete" && (
        <DeleteProjectDialog project={dialog.project} action={deleteAction} isOpen onClose={close} />
      )}
    </div>
  );
}
