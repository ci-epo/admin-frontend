import { filterAndSortArchives } from "@/lib/utils/archive-filters";
import type { ArchiveItem } from "@/types/archive";

const buildItem = (overrides: Partial<ArchiveItem>): ArchiveItem => ({
  id: "1",
  type: "documents",
  title: "Titre",
  description: "",
  reference: "ARC-001",
  category: "comptes-rendus",
  year: 2024,
  dateArchived: "1 janv. 2024",
  format: "pdf",
  fileSize: "1 Mo",
  visibility: "public",
  ...overrides,
});

describe("filterAndSortArchives", () => {
  const items = [
    buildItem({ id: "1", title: "Bilan", year: 2023, reference: "ARC-001" }),
    buildItem({ id: "2", title: "Agenda", year: 2025, reference: "ARC-003", category: "finances" }),
    buildItem({ id: "3", title: "Photo", type: "medias", year: 2024, reference: "ARC-002" }),
  ];

  it("ne garde que le type demandé", () => {
    const result = filterAndSortArchives(items, { type: "documents", category: "all", sortBy: "recent" });

    expect(result.map((i) => i.id)).toEqual(["2", "1"]);
  });

  it("filtre par catégorie quand elle n'est pas « all »", () => {
    const result = filterAndSortArchives(items, { type: "documents", category: "finances", sortBy: "recent" });

    expect(result.map((i) => i.id)).toEqual(["2"]);
  });

  it("trie par année croissante", () => {
    const result = filterAndSortArchives(items, { type: "documents", category: "all", sortBy: "year-asc" });

    expect(result.map((i) => i.year)).toEqual([2023, 2025]);
  });

  it("trie par titre alphabétique", () => {
    const result = filterAndSortArchives(items, { type: "documents", category: "all", sortBy: "title" });

    expect(result.map((i) => i.title)).toEqual(["Agenda", "Bilan"]);
  });

  it("ne modifie pas la liste d'origine", () => {
    const snapshot = items.map((i) => i.id);

    filterAndSortArchives(items, { type: "documents", category: "all", sortBy: "title" });

    expect(items.map((i) => i.id)).toEqual(snapshot);
  });
});
