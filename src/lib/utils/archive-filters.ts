import type { ArchiveItem, ArchiveSortKey, ArchiveType } from "@/types/archive";

interface ArchiveQuery {
  type: ArchiveType;
  /** Identifiant de catégorie, ou `"all"` pour ne pas filtrer. */
  category: string;
  sortBy: ArchiveSortKey;
}

export function filterAndSortArchives(
  items: readonly ArchiveItem[],
  { type, category, sortBy }: ArchiveQuery,
): ArchiveItem[] {
  const filtered = items.filter(
    (item) => item.type === type && (category === "all" || item.category === category),
  );

  return filtered.sort((a, b) => {
    if (sortBy === "year-desc") return b.year - a.year;
    if (sortBy === "year-asc") return a.year - b.year;
    if (sortBy === "title") return a.title.localeCompare(b.title, "fr");
    return b.reference.localeCompare(a.reference);
  });
}
