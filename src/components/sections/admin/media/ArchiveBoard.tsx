"use client";

import { useMemo, useState } from "react";
import DeleteMediaDialog from "@/components/sections/admin/media/DeleteMediaDialog";
import MediaEditModal from "@/components/sections/admin/media/MediaEditModal";
import MediaUploadModal from "@/components/sections/admin/media/MediaUploadModal";
import Alert from "@/components/ui/alert/Alert";
import RowActions from "@/components/ui/dropdown/RowActions";
import EmptyState from "@/components/ui/empty-state/EmptyState";
import TableFooter from "@/components/ui/table/TableFooter";
import TableToolbar from "@/components/ui/table/TableToolbar";
import { usePagination } from "@/hooks/use-pagination";
import { formatBytes } from "@/lib/utils/format-bytes";
import { filterBySearch } from "@/lib/utils/text-search";
import type { FormAction } from "@/types/administration";
import type { MediaRow } from "@/types/media";

interface ArchiveBoardProps {
  rows: MediaRow[];
  unavailable: boolean;
  updateAction: FormAction;
  deleteAction: FormAction;
}

const PAGE_SIZE = 10;
const ALL_CATEGORIES = "Toutes les catégories";
const ALL_YEARS = "Toutes les années";

type OpenDialog = { kind: "add" } | { kind: "edit" | "delete"; media: MediaRow } | null;

/** Extension affichée d'un document, d'après son nom d'origine (« PDF », « DOCX »…). */
const formatOf = (media: MediaRow): string => media.originalName.split(".").pop()?.toUpperCase() ?? "";

const dateOf = (media: MediaRow): string =>
  media.createdAt ? new Date(media.createdAt).toLocaleDateString("fr-FR") : "—";

/** Archives du club : documents réservés au bureau, classés par catégorie et par année. */
export default function ArchiveBoard({ rows, unavailable, updateAction, deleteAction }: ArchiveBoardProps) {
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [year, setYear] = useState(ALL_YEARS);

  const categories = useMemo(
    () => [ALL_CATEGORIES, ...[...new Set(rows.map((media) => media.category).filter((value): value is string => !!value))].sort()],
    [rows],
  );
  const years = useMemo(
    () => [ALL_YEARS, ...[...new Set(rows.map((media) => media.year).filter((value): value is number => value !== undefined))].sort((a, b) => b - a).map(String)],
    [rows],
  );

  const filtered = useMemo(() => {
    const matching = rows.filter(
      (media) =>
        (category === ALL_CATEGORIES || media.category === category) && (year === ALL_YEARS || String(media.year) === year),
    );
    return filterBySearch(matching, query, (media) => [media.title, media.category ?? "", media.originalName, String(media.year ?? "")]);
  }, [rows, query, category, year]);

  const { items, page, totalPages, from, to, total, setPage } = usePagination(filtered, PAGE_SIZE);
  const close = () => setDialog(null);
  const hasFilter = query.trim() !== "" || category !== ALL_CATEGORIES || year !== ALL_YEARS;

  return (
    <div className="card position-relative z-1">
      <TableToolbar
        title="Archives"
        addLabel="Ajouter un document"
        onAdd={() => setDialog({ kind: "add" })}
        searchPlaceholder="Rechercher un document..."
        searchValue={query}
        onSearchChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
        filters={[
          { label: category, options: categories, value: category, onChange: (value) => { setCategory(value); setPage(1); } },
          { label: year, options: years, value: year, onChange: (value) => { setYear(value); setPage(1); } },
        ]}
        size="md"
      />
      <div className="card-body">
        {unavailable && (
          <Alert
            variant="warning"
            icon="ri-alert-line"
            message="La liste n'a pas pu être chargée : app-service ne répond pas. Rechargez la page dans un instant."
            className="mb-3"
          />
        )}
        <p className="text-muted small">
          <i className="ri-lock-line me-1" aria-hidden="true"></i>
          Les archives sont réservées au bureau : elles ne s&apos;affichent jamais sur le site public.
        </p>
        {total === 0 ? (
          <EmptyState
            icon="ri-archive-2-line"
            title={hasFilter ? "Aucun document ne correspond" : "Aucun document archivé"}
            description={!hasFilter && !unavailable ? "Ajoutez un compte rendu, un rapport ou une affiche." : undefined}
          />
        ) : (
          <>
            <div className="table-box table-responsive">
              <table className="table table-hover">
                <thead className="table-light border-0">
                  <tr>
                    <th>Document</th>
                    <th>Catégorie</th>
                    <th>Année</th>
                    <th>Format</th>
                    <th>Ajouté le</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((media) => (
                    <tr key={media.publicId}>
                      <td>
                        <div className="fw-semibold">{media.title}</div>
                        <div className="text-muted small">{media.originalName}</div>
                      </td>
                      <td>{media.category ? <span className="badge bg-light text-dark border">{media.category}</span> : "—"}</td>
                      <td>{media.year ?? "—"}</td>
                      <td className="text-nowrap">
                        {formatOf(media)} · {formatBytes(media.sizeBytes)}
                      </td>
                      <td className="text-nowrap">{dateOf(media)}</td>
                      <td className="text-end text-nowrap">
                        <a
                          className="btn btn-light btn-sm me-1"
                          href={`/api/media/${encodeURIComponent(media.publicId)}/file?download=1`}
                          aria-label={`Télécharger ${media.title}`}
                        >
                          <i className="ri-download-2-line" aria-hidden="true"></i>
                        </a>
                        <span className="d-inline-block align-middle">
                          <RowActions
                            ariaLabel={`Actions pour ${media.title}`}
                            actions={[
                              { label: "Modifier", icon: "ri-pencil-line", onClick: () => setDialog({ kind: "edit", media }) },
                              { label: "Supprimer", icon: "ri-delete-bin-line", onClick: () => setDialog({ kind: "delete", media }), danger: true },
                            ]}
                          />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TableFooter from={from} to={to} total={total} emptyLabel="" page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <MediaUploadModal key={`upload-${dialog?.kind === "add"}`} kind="DOCUMENT" isOpen={dialog?.kind === "add"} onClose={close} />
      {dialog && dialog.kind === "edit" && (
        <MediaEditModal key={dialog.media.publicId} media={dialog.media} action={updateAction} isOpen onClose={close} />
      )}
      {dialog && dialog.kind === "delete" && (
        <DeleteMediaDialog media={dialog.media} action={deleteAction} isOpen onClose={close} />
      )}
    </div>
  );
}
