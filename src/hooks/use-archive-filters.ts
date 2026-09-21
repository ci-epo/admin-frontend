import { useState } from "react";
import { usePagination } from "@/hooks/use-pagination";
import { filterAndSortArchives } from "@/lib/utils/archive-filters";
import type {
  ArchiveItem,
  ArchiveSortKey,
  ArchiveType,
  ArchiveViewMode,
} from "@/types/archive";

/** Filtres, tri, mode d'affichage et pagination du catalogue d'archives. */
export function useArchiveFilters(items: readonly ArchiveItem[], pageSize: number) {
  const [activeType, setActiveType] = useState<ArchiveType>("documents");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<ArchiveSortKey>("recent");
  const [viewMode, setViewMode] = useState<ArchiveViewMode>("grid");

  const filtered = filterAndSortArchives(items, {
    type: activeType,
    category: activeCategory,
    sortBy,
  });
  const pagination = usePagination(filtered, pageSize);
  const { setPage } = pagination;

  const changeType = (type: ArchiveType) => {
    setActiveType(type);
    setActiveCategory("all");
    setPage(1);
  };

  const changeCategory = (category: string) => {
    setActiveCategory(category);
    setPage(1);
  };

  const changeSort = (sort: ArchiveSortKey) => {
    setSortBy(sort);
    setPage(1);
  };

  const reset = () => {
    setActiveCategory("all");
    setSortBy("recent");
    setPage(1);
  };

  return {
    activeType,
    activeCategory,
    sortBy,
    viewMode,
    pagination,
    changeType,
    changeCategory,
    changeSort,
    setViewMode,
    reset,
  };
}
