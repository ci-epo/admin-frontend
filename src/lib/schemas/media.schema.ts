import { asObject, invalidResponse, readBoolean, readNumber, readString } from "@/lib/schemas/guards";
import type { FormResult } from "@/lib/schemas/project.schema";
import type { MediaKind, MediaPatch, MediaPlacement, MediaRow } from "@/types/media";

const MEBIBYTE = 1024 * 1024;

/** Mêmes plafonds que `MEDIA_MAX_*_MB` d'app-service : refuser ici évite d'envoyer un fichier que l'API rejettera. */
export const MEDIA_MAX_BYTES = {
  PHOTO: 15 * MEBIBYTE,
  VIDEO: 250 * MEBIBYTE,
  DOCUMENT: 50 * MEBIBYTE,
  POSTER: 5 * MEBIBYTE,
} as const;

interface FileKind {
  /** Valeur de l'attribut `accept` du sélecteur de fichier. */
  accept: string;
  /** Type MIME par extension : `File.type` est parfois vide (Windows, Word…), l'extension sert alors de repli. */
  mimeByExtension: Readonly<Record<string, string>>;
  label: string;
}

const IMAGES = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" } as const;

export const MEDIA_FILE_KINDS: Readonly<Record<MediaKind | "POSTER", FileKind>> = {
  PHOTO: { accept: ".jpg,.jpeg,.png,.webp", mimeByExtension: IMAGES, label: "JPEG, PNG ou WebP" },
  VIDEO: { accept: ".mp4,.webm", mimeByExtension: { mp4: "video/mp4", webm: "video/webm" }, label: "MP4 ou WebM" },
  DOCUMENT: {
    accept: ".pdf,.docx,.xlsx,.pptx",
    mimeByExtension: {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    },
    label: "PDF, Word, Excel ou PowerPoint",
  },
  POSTER: { accept: ".jpg,.jpeg,.png,.webp", mimeByExtension: IMAGES, label: "JPEG, PNG ou WebP" },
};

/** Type MIME à annoncer à l'API pour ce fichier, ou `null` s'il n'est pas accepté pour cette nature. */
export function mimeTypeFor(kind: MediaKind | "POSTER", file: { name: string; type: string }): string | null {
  const { mimeByExtension } = MEDIA_FILE_KINDS[kind];
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const byExtension = mimeByExtension[extension];
  if (!byExtension) return null;
  // Un type renseigné par le navigateur doit être cohérent avec l'extension (pas de .jpg déguisé en autre chose).
  return file.type && file.type !== byExtension ? null : byExtension;
}

const KINDS: readonly MediaKind[] = ["PHOTO", "VIDEO", "DOCUMENT"];
const PLACEMENTS: readonly MediaPlacement[] = ["HOME", "ACTIVITIES", "BOTH"];

export const PLACEMENT_LABELS: Readonly<Record<MediaPlacement, string>> = {
  HOME: "Accueil",
  ACTIVITIES: "Activités",
  BOTH: "Accueil et activités",
};

export function parseMediaDto(value: unknown, what = "media"): MediaRow {
  const media = asObject(value, what);
  const kind = readString(media, "kind", what);
  const placement = readString(media, "placement", what);
  if (!KINDS.includes(kind as MediaKind)) throw invalidResponse(`${what}.kind`, kind);
  if (!PLACEMENTS.includes(placement as MediaPlacement)) throw invalidResponse(`${what}.placement`, placement);

  const optionalText = (key: string): string | undefined => {
    const field = media[key];
    if (field === undefined) return undefined;
    if (typeof field !== "string") throw invalidResponse(`${what}.${key}`, field);
    return field;
  };
  const year = media.year;
  if (year !== undefined && typeof year !== "number") throw invalidResponse(`${what}.year`, year);

  return {
    publicId: readString(media, "publicId", what),
    kind: kind as MediaKind,
    title: readString(media, "title", what),
    tag: optionalText("tag"),
    caption: optionalText("caption"),
    alt: optionalText("alt"),
    category: optionalText("category"),
    year,
    placement: placement as MediaPlacement,
    isPublished: readBoolean(media, "isPublished", what),
    sortOrder: readNumber(media, "sortOrder", what),
    originalName: readString(media, "originalName", what),
    mimeType: readString(media, "mimeType", what),
    sizeBytes: readNumber(media, "sizeBytes", what),
    hasPoster: readBoolean(media, "hasPoster", what),
    createdAt: optionalText("createdAt"),
  };
}

export function parseMediaListDto(value: unknown): MediaRow[] {
  const source = asObject(value, "media");
  if (!Array.isArray(source.data)) throw invalidResponse("media.data", source.data);
  return source.data.map((item) => parseMediaDto(item, "media.data[]"));
}

const MAX_YEAR = 2100;
const MIN_YEAR = 1990;

/** Formulaire de modification : seuls les champs de la nature du média (`kind`) sont lus. */
export function parseMediaForm(form: FormData): FormResult<{ publicId: string; patch: MediaPatch }> {
  const text = (name: string) => String(form.get(name) ?? "").trim();
  const kind = text("kind") as MediaKind;
  const isDocument = kind === "DOCUMENT";
  const yearText = text("year");
  const sortOrderText = text("sortOrder");

  const patch: MediaPatch = {
    title: text("title"),
    tag: text("tag"),
    caption: text("caption"),
    alt: text("alt"),
    category: text("category"),
    year: yearText === "" ? null : Number(yearText),
    placement: (text("placement") || "BOTH") as MediaPlacement,
    isPublished: form.get("isPublished") === "on",
    sortOrder: sortOrderText === "" ? 0 : Number(sortOrderText),
  };

  const fieldErrors: Record<string, string> = {};
  if (!KINDS.includes(kind)) fieldErrors.kind = "Nature de média inconnue.";
  if (!patch.title) fieldErrors.title = "Le titre est requis.";
  if (patch.title.length > 120) fieldErrors.title = "120 caractères au plus.";
  if (patch.tag.length > 40) fieldErrors.tag = "40 caractères au plus.";
  if (patch.caption.length > 400) fieldErrors.caption = "400 caractères au plus.";
  if (patch.alt.length > 200) fieldErrors.alt = "200 caractères au plus.";
  if (patch.category.length > 60) fieldErrors.category = "60 caractères au plus.";
  if (patch.year !== null && (!Number.isInteger(patch.year) || patch.year < MIN_YEAR || patch.year > MAX_YEAR)) {
    fieldErrors.year = `Une année entre ${MIN_YEAR} et ${MAX_YEAR}.`;
  }
  if (!Number.isInteger(patch.sortOrder) || Math.abs(patch.sortOrder) > 9999) {
    fieldErrors.sortOrder = "Un entier entre -9999 et 9999.";
  }
  if (!PLACEMENTS.includes(patch.placement)) fieldErrors.placement = "Page inconnue.";
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };

  // Un document n'a ni page du site ni ordre d'affichage : on n'y touche pas.
  const data: MediaPatch = isDocument ? { ...patch, placement: "BOTH", sortOrder: 0, isPublished: true } : patch;
  return { ok: true, data: { publicId: text("publicId"), patch: data } };
}
