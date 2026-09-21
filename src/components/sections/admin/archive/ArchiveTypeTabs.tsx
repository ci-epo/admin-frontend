import type { ArchiveType, ArchiveTypeTab } from "@/types/archive";

interface ArchiveTypeTabsProps {
  tabs: readonly ArchiveTypeTab[];
  activeType: ArchiveType;
  onChange: (type: ArchiveType) => void;
}

export default function ArchiveTypeTabs({ tabs, activeType, onChange }: ArchiveTypeTabsProps) {
  return (
    <div className="archive-type-tabs-row d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
      <div className="archive-type-tabs-wrapper">
        <div className="archive-type-tabs" role="tablist" aria-label="Types d'archives">
          {tabs.map((tab) => (
            <button
              key={tab.type}
              type="button"
              role="tab"
              aria-selected={activeType === tab.type}
              className={`archive-type-tab${activeType === tab.type ? " active" : ""}`}
              onClick={() => onChange(tab.type)}
            >
              <i className={`${tab.icon} archive-type-tab-icon`} aria-hidden></i>
              <span className="archive-type-tab-label">{tab.label}</span>
              <span className="archive-type-tab-count">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>
      <button type="button" className="btn btn-danger flex-shrink-0 ms-xl-auto">
        <i className="ri-add-line me-1"></i>Ajouter
      </button>
    </div>
  );
}
