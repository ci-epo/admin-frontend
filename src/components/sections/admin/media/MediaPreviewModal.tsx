"use client";

import Modal from "@/components/ui/modal/Modal";
import type { MediaRow } from "@/types/media";

interface MediaPreviewModalProps {
  media: MediaRow;
  isOpen: boolean;
  onClose: () => void;
}

/** Lecture d'une photo ou d'une vidéo telle que le public la verra. Rien n'est téléchargé tant que la modale est fermée. */
export default function MediaPreviewModal({ media, isOpen, onClose }: MediaPreviewModalProps) {
  const src = `/api/media/${encodeURIComponent(media.publicId)}/file`;

  return (
    <Modal title={media.title} isOpen={isOpen} onClose={onClose} dialog={{ centered: true, size: "lg" }}>
      {isOpen &&
        (media.kind === "VIDEO" ? (
          <video src={src} controls autoPlay preload="metadata" className="w-100 rounded bg-dark" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- fichier servi par la route authentifiée de l'admin
          <img src={src} alt={media.alt ?? media.title} className="img-fluid rounded w-100" />
        ))}
      {media.caption && <p className="text-muted mt-3 mb-0">{media.caption}</p>}
    </Modal>
  );
}
