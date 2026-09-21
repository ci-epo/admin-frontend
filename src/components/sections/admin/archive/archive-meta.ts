import type { ArchiveFormat, ArchiveVisibility } from "@/types/archive";

interface FormatMeta {
  icon: string;
  bgClass: string;
  textClass: string;
  label: string;
}

interface VisibilityMeta {
  label: string;
  className: string;
  icon: string;
}

export const FORMAT_META: Record<ArchiveFormat, FormatMeta> = {
  pdf: { icon: "ri-file-pdf-2-line", bgClass: "bg-danger-subtle", textClass: "text-danger", label: "PDF" },
  doc: { icon: "ri-file-word-2-line", bgClass: "bg-primary-subtle", textClass: "text-primary", label: "DOC" },
  xls: { icon: "ri-file-excel-2-line", bgClass: "bg-success-subtle", textClass: "text-success", label: "XLS" },
  image: { icon: "ri-image-2-line", bgClass: "bg-info-subtle", textClass: "text-info", label: "Image" },
  video: { icon: "ri-video-on-line", bgClass: "bg-warning-subtle", textClass: "text-warning", label: "Vidéo" },
  zip: { icon: "ri-folder-zip-line", bgClass: "bg-secondary-subtle", textClass: "text-secondary", label: "ZIP" },
  code: { icon: "ri-code-s-slash-line", bgClass: "bg-dark-subtle", textClass: "text-dark", label: "Code" },
};

export const VISIBILITY_META: Record<ArchiveVisibility, VisibilityMeta> = {
  public: { label: "Public", className: "bg-success-subtle text-success", icon: "ri-global-line" },
  membres: { label: "Membres", className: "bg-primary-subtle text-primary", icon: "ri-group-line" },
  bureau: { label: "Bureau", className: "bg-warning-subtle text-warning", icon: "ri-shield-user-line" },
};
