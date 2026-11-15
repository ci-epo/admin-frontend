export type MediaKind = "PHOTO" | "VIDEO" | "DOCUMENT";
export type MediaPlacement = "HOME" | "ACTIVITIES" | "BOTH";

/** Fiche d'un média (photo, vidéo ou document d'archive), telle que l'expose `GET /media`. */
export interface MediaRow {
  publicId: string;
  kind: MediaKind;
  title: string;
  tag?: string;
  caption?: string;
  alt?: string;
  category?: string;
  year?: number;
  placement: MediaPlacement;
  isPublished: boolean;
  sortOrder: number;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  hasPoster: boolean;
  createdAt?: string;
}

/** Modification d'une fiche. Chaîne vide : efface un champ facultatif ; `year: null` efface l'année. */
export interface MediaPatch {
  title: string;
  tag: string;
  caption: string;
  alt: string;
  category: string;
  year: number | null;
  placement: MediaPlacement;
  isPublished: boolean;
  sortOrder: number;
}
