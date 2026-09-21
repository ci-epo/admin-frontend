export type ArchiveType = "documents" | "code" | "medias" | "evenements";

export type ArchiveFormat = "pdf" | "doc" | "xls" | "image" | "video" | "zip" | "code";

export type ArchiveVisibility = "public" | "membres" | "bureau";

export interface ArchiveItem {
  id: string;
  type: ArchiveType;
  title: string;
  description: string;
  reference: string;
  category: string;
  year: number;
  dateArchived: string;
  format: ArchiveFormat;
  fileSize: string;
  visibility: ArchiveVisibility;
  thumbnailSrc?: string;
  bureau?: string;
}

export interface ArchiveCategoryFilter {
  id: string;
  label: string;
  count: number;
}

export interface ArchiveTypeTab {
  type: ArchiveType;
  label: string;
  icon: string;
  count: number;
}

export type ArchiveSortKey = "recent" | "year-desc" | "year-asc" | "title";

export type ArchiveViewMode = "grid" | "list";
