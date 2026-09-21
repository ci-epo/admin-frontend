import type { ArchiveSortKey, ArchiveViewMode } from "@/types/archive";

interface ArchiveToolbarProps {
  total: number;
  /** Libellé du type actif, affiché après le compteur (ex: "Documents"). */
  typeLabel?: string;
  sortBy: ArchiveSortKey;
  onSortChange: (sort: ArchiveSortKey) => void;
  viewMode: ArchiveViewMode;
  onViewModeChange: (mode: ArchiveViewMode) => void;
}

const SORT_OPTIONS: ReadonlyArray<{ value: ArchiveSortKey; label: string }> = [
  { value: "recent", label: "Plus récents" },
  { value: "year-desc", label: "Année décroissante" },
  { value: "year-asc", label: "Année croissante" },
  { value: "title", label: "Titre (A–Z)" },
];

const VIEW_MODES: ReadonlyArray<{ mode: ArchiveViewMode; label: string; icon: string }> = [
  { mode: "grid", label: "Vue grille", icon: "ri-layout-grid-line" },
  { mode: "list", label: "Vue liste", icon: "ri-list-check" },
];

export default function ArchiveToolbar({
  total,
  typeLabel,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: ArchiveToolbarProps) {
  return (
    <div className="card archive-toolbar mb-4">
      <div className="card-body py-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div className="archive-catalogue-count">
          <strong>{total}</strong> {total > 1 ? "éléments archivés" : "élément archivé"}
          {typeLabel && <span className="text-muted ms-1">— {typeLabel}</span>}
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <select
            className="form-select form-select-sm archive-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as ArchiveSortKey)}
            aria-label="Trier les archives"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="btn-group archive-view-toggle" role="group" aria-label="Mode d'affichage">
            {VIEW_MODES.map(({ mode, label, icon }) => (
              <button
                key={mode}
                type="button"
                className={`btn btn-light btn-sm${viewMode === mode ? " active" : ""}`}
                onClick={() => onViewModeChange(mode)}
                aria-label={label}
                aria-pressed={viewMode === mode}
              >
                <i className={icon}></i>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
