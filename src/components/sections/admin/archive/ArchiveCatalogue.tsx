"use client";

import ArchiveFiltersSidebar from "@/components/sections/admin/archive/ArchiveFiltersSidebar";
import ArchiveResults from "@/components/sections/admin/archive/ArchiveResults";
import ArchiveToolbar from "@/components/sections/admin/archive/ArchiveToolbar";
import ArchiveTypeTabs from "@/components/sections/admin/archive/ArchiveTypeTabs";
import { useArchiveFilters } from "@/hooks/use-archive-filters";
import type {
  ArchiveCategoryFilter,
  ArchiveItem,
  ArchiveType,
  ArchiveTypeTab,
} from "@/types/archive";

interface ArchiveCatalogueProps {
  items: ArchiveItem[];
  typeTabs: ArchiveTypeTab[];
  categoriesByType: Record<ArchiveType, ArchiveCategoryFilter[]>;
}

const PAGE_SIZE = 6;

export default function ArchiveCatalogue({
  items,
  typeTabs,
  categoriesByType,
}: ArchiveCatalogueProps) {
  const filters = useArchiveFilters(items, PAGE_SIZE);
  const { pagination } = filters;
  const activeTab = typeTabs.find((tab) => tab.type === filters.activeType);

  return (
    <div className="position-relative z-1">
      <ArchiveTypeTabs
        tabs={typeTabs}
        activeType={filters.activeType}
        onChange={filters.changeType}
      />

      <button
        type="button"
        className="btn btn-outline-secondary w-100 d-xl-none mb-3"
        data-bs-toggle="offcanvas"
        data-bs-target="#archiveFiltersOffcanvas"
      >
        <i className="ri-filter-3-line me-2"></i>Filtres
      </button>

      <div className="row g-4">
        <ArchiveFiltersSidebar
          activeType={filters.activeType}
          categories={categoriesByType[filters.activeType]}
          activeCategory={filters.activeCategory}
          onCategoryChange={filters.changeCategory}
          onReset={filters.reset}
        />

        <div className="col-xl-9">
          <ArchiveToolbar
            total={pagination.total}
            typeLabel={activeTab?.label}
            sortBy={filters.sortBy}
            onSortChange={filters.changeSort}
            viewMode={filters.viewMode}
            onViewModeChange={filters.setViewMode}
          />
          <ArchiveResults
            slice={pagination}
            viewMode={filters.viewMode}
            onPageChange={pagination.setPage}
            onReset={filters.reset}
          />
        </div>
      </div>
    </div>
  );
}
