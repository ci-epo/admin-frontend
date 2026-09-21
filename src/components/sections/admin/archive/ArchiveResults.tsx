import ArchiveCard from "@/components/sections/admin/archive/ArchiveCard";
import EmptyState from "@/components/ui/empty-state/EmptyState";
import Pagination from "@/components/ui/pagination/Pagination";
import type { PageSlice } from "@/lib/utils/pagination";
import type { ArchiveItem, ArchiveViewMode } from "@/types/archive";

interface ArchiveResultsProps {
  slice: PageSlice<ArchiveItem>;
  viewMode: ArchiveViewMode;
  onPageChange: (page: number) => void;
  onReset: () => void;
}

export default function ArchiveResults({
  slice,
  viewMode,
  onPageChange,
  onReset,
}: ArchiveResultsProps) {
  if (slice.total === 0) {
    return (
      <EmptyState
        icon="ri-inbox-archive-line"
        title="Aucun élément trouvé"
        description="Aucune archive ne correspond à vos filtres actuels."
        action={
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={onReset}>
            <i className="ri-refresh-line me-1"></i>Réinitialiser les filtres
          </button>
        }
      />
    );
  }

  const cards = slice.items.map((item, i) => (
    <ArchiveCard key={item.id} item={item} view={viewMode} index={i} />
  ));

  return (
    <>
      {viewMode === "grid" ? <div className="row g-4">{cards}</div> : <div>{cards}</div>}

      {slice.totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            page={slice.page}
            totalPages={slice.totalPages}
            onChange={onPageChange}
            appearance={{ color: "primary" }}
          />
        </div>
      )}
    </>
  );
}
