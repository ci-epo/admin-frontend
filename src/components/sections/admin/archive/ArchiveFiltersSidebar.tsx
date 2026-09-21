"use client";

import { useId, useState } from "react";
import ArchiveFilterChips from "@/components/sections/admin/archive/ArchiveFilterChips";
import InputIcon from "@/components/ui/form/input/InputIcon";
import type { ArchiveCategoryFilter, ArchiveType } from "@/types/archive";

interface ArchiveFiltersSidebarProps {
  activeType: ArchiveType;
  categories: ArchiveCategoryFilter[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  onReset: () => void;
  offcanvasId?: string;
}

const FORMAT_CHIPS: Record<ArchiveType, string[]> = {
  documents: ["PDF", "DOC", "XLS", "ZIP"],
  code: ["TypeScript", "JavaScript", "Python", "SQL", "ZIP"],
  medias: ["Photos", "Vidéos", "PDF"],
  evenements: ["Sport", "Culture", "Formation"],
};

const VISIBILITY_CHIPS = ["Public", "Membres", "Bureau"];

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function ArchiveFiltersSidebar({
  activeType,
  categories,
  activeCategory,
  onCategoryChange,
  onReset,
  offcanvasId = "archiveFiltersOffcanvas",
}: ArchiveFiltersSidebarProps) {
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [activeVisibility, setActiveVisibility] = useState<string[]>([]);
  const searchId = useId();

  const yearTitle = activeType === "evenements" ? "Année de l'événement" : "Année d'archivage";

  const handleReset = () => {
    setActiveFormats([]);
    setActiveVisibility([]);
    onReset();
  };

  const content = (
    <div className="card archive-filters-card overflow-hidden mb-0">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="fs-16 mb-0">
          <i className="ri-filter-3-line me-2 text-primary"></i>Filtres
        </h3>
        <button
          type="button"
          className="btn btn-link btn-sm p-0 text-decoration-none"
          onClick={handleReset}
        >
          <i className="ri-refresh-line me-1"></i>Effacer
        </button>
      </div>

      <div className="px-4 pt-3">
        <InputIcon
          id={`${searchId}-filters`}
          type="search"
          icon="ri-search-2-line text-muted"
          iconPosition="right"
          className="rounded-3"
          placeholder="Rechercher dans les filtres..."
          aria-label="Rechercher dans les filtres"
        />
      </div>

      <div className="card-body border-bottom">
        <h4 className="text-muted text-uppercase fs-12 fw-medium mb-3">Catégorie</h4>
        <ul className="list-unstyled mb-0 archive-filter-list">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                className={`archive-filter-item w-100 d-flex justify-content-between align-items-center${
                  activeCategory === cat.id ? " active" : ""
                }`}
                onClick={() => onCategoryChange(cat.id)}
              >
                <span>{cat.label}</span>
                <span className="badge bg-light text-muted">{cat.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card-body border-bottom">
        <h4 className="text-muted text-uppercase fs-12 fw-medium mb-3">{yearTitle}</h4>
        <div className="row g-2">
          <div className="col-6">
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="De"
              aria-label="Année de début"
              defaultValue={2020}
            />
          </div>
          <div className="col-6">
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="À"
              aria-label="Année de fin"
              defaultValue={2025}
            />
          </div>
        </div>
      </div>

      <div className="card-body border-bottom">
        <ArchiveFilterChips
          title="Format"
          options={FORMAT_CHIPS[activeType]}
          selected={activeFormats}
          onToggle={(value) => setActiveFormats((list) => toggleValue(list, value))}
        />
      </div>

      <div className="card-body">
        <ArchiveFilterChips
          title="Visibilité"
          options={VISIBILITY_CHIPS}
          selected={activeVisibility}
          onToggle={(value) => setActiveVisibility((list) => toggleValue(list, value))}
        />
      </div>
    </div>
  );

  return (
    <>
      <aside className="d-none d-xl-block col-xl-3">{content}</aside>

      <div
        className="offcanvas offcanvas-start d-xl-none"
        tabIndex={-1}
        id={offcanvasId}
        aria-labelledby={`${offcanvasId}Label`}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id={`${offcanvasId}Label`}>
            Filtres
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Fermer"></button>
        </div>
        <div className="offcanvas-body p-0">{content}</div>
      </div>
    </>
  );
}
