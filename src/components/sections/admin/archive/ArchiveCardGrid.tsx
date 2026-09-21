import Image from "next/image";
import type { CSSProperties } from "react";
import { FORMAT_META, VISIBILITY_META } from "@/components/sections/admin/archive/archive-meta";
import type { ArchiveItem } from "@/types/archive";

interface ArchiveCardGridProps {
  item: ArchiveItem;
  style: CSSProperties;
}

export default function ArchiveCardGrid({ item, style }: ArchiveCardGridProps) {
  const format = FORMAT_META[item.format];
  const visibility = VISIBILITY_META[item.visibility];

  return (
    <div className="col-md-6 col-xl-4">
      <div className="card archive-card archive-animate-in h-100" style={style}>
        {item.thumbnailSrc ? (
          <div className="archive-card-thumb position-relative">
            <Image
              src={item.thumbnailSrc}
              width={400}
              height={267}
              className="card-img-top object-fit-cover"
              alt=""
            />
            <span className={`badge position-absolute top-0 start-0 m-3 ${format.bgClass} ${format.textClass}`}>
              <i className={`${format.icon} me-1`}></i>
              {format.label}
            </span>
            <span className={`badge position-absolute top-0 end-0 m-3 ${visibility.className}`}>
              <i className={`${visibility.icon} me-1`}></i>{visibility.label}
            </span>
          </div>
        ) : (
          <div className={`archive-card-icon-header ${format.bgClass} ${format.textClass}`}>
            <i className={`${format.icon} archive-card-icon-lg`}></i>
            <span className="badge bg-white text-body shadow-sm">{format.label}</span>
          </div>
        )}

        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
            <h5 className="card-title mb-0 fs-15">{item.title}</h5>
            <div className="dropdown flex-shrink-0">
              <button
                className="btn btn-light btn-sm"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="Actions"
              >
                <i className="ri-more-2-fill"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button type="button" className="dropdown-item"><i className="ri-eye-line me-2"></i>Consulter</button></li>
                <li><button type="button" className="dropdown-item"><i className="ri-download-2-line me-2"></i>Télécharger</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button type="button" className="dropdown-item"><i className="ri-share-line me-2"></i>Partager</button></li>
              </ul>
            </div>
          </div>

          <p className="card-text text-muted small flex-grow-1">{item.description}</p>

          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="badge bg-light text-muted text-capitalize">
              {item.category.replace(/-/g, " ")}
            </span>
            <span className="badge bg-light text-muted">{item.year}</span>
            <span className="font-monospace fs-11 text-muted ms-auto">{item.reference}</span>
          </div>

          <div className="archive-card-meta d-flex justify-content-between align-items-center text-muted small mb-3">
            <span><i className="ri-calendar-line me-1"></i>{item.dateArchived}</span>
            {item.fileSize !== "—" ? (
              <span><i className="ri-hard-drive-2-line me-1"></i>{item.fileSize}</span>
            ) : item.bureau ? (
              <span><i className="ri-building-line me-1"></i>{item.bureau}</span>
            ) : null}
          </div>

          <div className="d-flex gap-2 mt-auto">
            <button type="button" className="btn btn-light btn-sm flex-grow-1">
              <i className="ri-eye-line me-1"></i>Consulter
            </button>
            <button type="button" className="btn btn-primary btn-sm flex-grow-1">
              <i className="ri-download-2-line me-1"></i>Télécharger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
