import type { CSSProperties } from "react";
import { FORMAT_META, VISIBILITY_META } from "@/components/sections/admin/archive/archive-meta";
import type { ArchiveItem } from "@/types/archive";

interface ArchiveCardListProps {
  item: ArchiveItem;
  style: CSSProperties;
}

export default function ArchiveCardList({ item, style }: ArchiveCardListProps) {
  const format = FORMAT_META[item.format];
  const visibility = VISIBILITY_META[item.visibility];

  return (
    <div className="card archive-card archive-card-list archive-animate-in mb-3" style={style}>
      <div className="card-body d-flex flex-column flex-md-row align-items-md-center gap-3">
        <div
          className={`archive-file-icon flex-shrink-0 ${format.bgClass} ${format.textClass}`}
          aria-hidden
        >
          <i className={format.icon}></i>
        </div>
        <div className="flex-grow-1 min-w-0">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
            <h6 className="mb-0 text-truncate">{item.title}</h6>
            <span className="badge bg-light text-muted font-monospace fs-11">{item.reference}</span>
          </div>
          <p className="text-muted mb-2 small text-truncate-2">{item.description}</p>
          <div className="d-flex flex-wrap gap-2 align-items-center small text-muted">
            <span className="badge bg-light text-muted text-capitalize">
              {item.category.replace(/-/g, " ")}
            </span>
            <span><i className="ri-calendar-line me-1"></i>{item.dateArchived}</span>
            {item.fileSize !== "—" && (
              <span><i className="ri-hard-drive-2-line me-1"></i>{item.fileSize}</span>
            )}
            <span className={`badge ${visibility.className}`}>
              <i className={`${visibility.icon} me-1`}></i>{visibility.label}
            </span>
          </div>
        </div>
        <div className="d-flex gap-2 flex-shrink-0">
          <button type="button" className="btn btn-light btn-sm">
            <i className="ri-eye-line me-1"></i>Consulter
          </button>
          <button type="button" className="btn btn-primary btn-sm">
            <i className="ri-download-2-line me-1"></i>Télécharger
          </button>
        </div>
      </div>
    </div>
  );
}
