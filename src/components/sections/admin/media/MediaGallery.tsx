"use client";

import { useMemo, useState } from "react";
import DeleteMediaDialog from "@/components/sections/admin/media/DeleteMediaDialog";
import MediaEditModal from "@/components/sections/admin/media/MediaEditModal";
import MediaPreviewModal from "@/components/sections/admin/media/MediaPreviewModal";
import MediaUploadModal from "@/components/sections/admin/media/MediaUploadModal";
import StatusBadge from "@/components/ui/badge/StatusBadge";
import RowActions from "@/components/ui/dropdown/RowActions";
import EmptyState from "@/components/ui/empty-state/EmptyState";
import TableFooter from "@/components/ui/table/TableFooter";
import TableToolbar from "@/components/ui/table/TableToolbar";
import Alert from "@/components/ui/alert/Alert";
import { usePagination } from "@/hooks/use-pagination";
import { PLACEMENT_LABELS } from "@/lib/schemas/media.schema";
import { formatBytes } from "@/lib/utils/format-bytes";
import { filterBySearch } from "@/lib/utils/text-search";
import type { FormAction } from "@/types/administration";
import type { MediaKind, MediaRow } from "@/types/media";

interface MediaGalleryProps {
  kind: Exclude<MediaKind, "DOCUMENT">;
  rows: MediaRow[];
  /** L'API n'a pas répondu : la liste vide ne veut pas dire « aucun média ». */
  unavailable: boolean;
  updateAction: FormAction;
  deleteAction: FormAction;
}

const PAGE_SIZE = 12;

const TEXT = {
  PHOTO: { title: "Photos", noun: "photo", empty: "Aucune photo pour le moment", icon: "ri-image-2-line", search: "Rechercher une photo..." },
  VIDEO: { title: "Vidéos", noun: "vidéo", empty: "Aucune vidéo pour le moment", icon: "ri-movie-2-line", search: "Rechercher une vidéo..." },
} as const;

type OpenDialog =
  | { kind: "add" }
  | { kind: "preview" | "edit" | "delete"; media: MediaRow }
  | null;

/** Photos ou vidéos du site : cartes avec aperçu, état de publication et page d'affichage. */
export default function MediaGallery({ kind, rows, unavailable, updateAction, deleteAction }: MediaGalleryProps) {
  const text = TEXT[kind];
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      filterBySearch(rows, query, (media) => [
        media.title,
        media.tag ?? "",
        media.caption ?? "",
        PLACEMENT_LABELS[media.placement],
        media.isPublished ? "Publié" : "Brouillon",
      ]),
    [rows, query],
  );
  const { items, page, totalPages, from, to, total, setPage } = usePagination(filtered, PAGE_SIZE);
  const close = () => setDialog(null);

  return (
    <div className="card position-relative z-1">
      <TableToolbar
        title={text.title}
        addLabel="Ajouter"
        onAdd={() => setDialog({ kind: "add" })}
        searchPlaceholder={text.search}
        searchValue={query}
        onSearchChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
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
        {total === 0 ? (
          <EmptyState
            icon={text.icon}
            title={rows.length > 0 ? `Aucun résultat pour « ${query.trim()} »` : text.empty}
            description={rows.length === 0 && !unavailable ? `Ajoutez la première ${text.noun} : elle apparaîtra sur le site.` : undefined}
          />
        ) : (
          <>
            <div className="row g-3">
              {items.map((media) => (
                <div key={media.publicId} className="col-12 col-sm-6 col-xl-4">
                  <article className="card h-100 mb-0 border">
                    <button
                      type="button"
                      className="p-0 border-0 bg-dark position-relative d-block w-100 text-start"
                      style={{ aspectRatio: "4 / 3", overflow: "hidden" }}
                      onClick={() => setDialog({ kind: "preview", media })}
                      aria-label={`Voir ${media.title}`}
                    >
                      {kind === "PHOTO" || media.hasPoster ? (
                        // eslint-disable-next-line @next/next/no-img-element -- fichier servi par la route authentifiée de l'admin
                        <img
                          src={`/api/media/${encodeURIComponent(media.publicId)}/${kind === "PHOTO" ? "file" : "poster"}`}
                          alt={media.alt ?? media.title}
                          loading="lazy"
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <span className="d-flex align-items-center justify-content-center h-100 text-white-50 fs-1">
                          <i className="ri-movie-2-line" aria-hidden="true"></i>
                        </span>
                      )}
                      {kind === "VIDEO" && (
                        <span className="position-absolute top-50 start-50 translate-middle text-white fs-1" aria-hidden="true">
                          <i className="ri-play-circle-fill"></i>
                        </span>
                      )}
                    </button>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <h6 className="mb-1">{media.title}</h6>
                        <RowActions
                          ariaLabel={`Actions pour ${media.title}`}
                          actions={[
                            { label: "Voir", icon: "ri-eye-line", onClick: () => setDialog({ kind: "preview", media }) },
                            { label: "Modifier", icon: "ri-pencil-line", onClick: () => setDialog({ kind: "edit", media }) },
                            { label: "Supprimer", icon: "ri-delete-bin-line", onClick: () => setDialog({ kind: "delete", media }), danger: true },
                          ]}
                        />
                      </div>
                      {media.tag && <p className="text-primary small fw-semibold mb-1">{media.tag}</p>}
                      {media.caption && <p className="text-muted small mb-2">{media.caption}</p>}
                      <div className="d-flex flex-wrap gap-1 align-items-center">
                        <StatusBadge label={media.isPublished ? "Publié" : "Brouillon"} tone={media.isPublished ? "success" : "secondary"} />
                        <StatusBadge label={PLACEMENT_LABELS[media.placement]} tone="info" />
                        <span className="text-muted small ms-1">{formatBytes(media.sizeBytes)}</span>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
            <TableFooter from={from} to={to} total={total} emptyLabel="" page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <MediaUploadModal key={`upload-${dialog?.kind === "add"}`} kind={kind} isOpen={dialog?.kind === "add"} onClose={close} />
      {dialog && dialog.kind === "preview" && <MediaPreviewModal media={dialog.media} isOpen onClose={close} />}
      {dialog && dialog.kind === "edit" && (
        <MediaEditModal key={dialog.media.publicId} media={dialog.media} action={updateAction} isOpen onClose={close} />
      )}
      {dialog && dialog.kind === "delete" && (
        <DeleteMediaDialog media={dialog.media} action={deleteAction} isOpen onClose={close} />
      )}
    </div>
  );
}
