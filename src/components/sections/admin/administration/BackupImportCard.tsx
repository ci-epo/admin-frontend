"use client";

import { useState, type ChangeEvent } from "react";
import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import { useActionForm } from "@/hooks/use-action-form";
import { BACKUP_UPLOAD_MAX_BYTES } from "@/lib/schemas/backup.schema";
import { formatBytes } from "@/lib/utils/format-bytes";
import type { FormAction } from "@/types/administration";

interface BackupImportCardProps {
  action: FormAction;
}

/** Ajoute une archive venue d'ailleurs (autre serveur, copie téléchargée) ; elle se restaure ensuite depuis la liste. */
export default function BackupImportCard({ action }: BackupImportCardProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const [sizeError, setSizeError] = useState<string | null>(null);

  // Vérifié avant l'envoi : au-delà, Next.js refuserait la requête sans message utile.
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setSizeError(file && file.size > BACKUP_UPLOAD_MAX_BYTES ? `Fichier trop volumineux (${formatBytes(BACKUP_UPLOAD_MAX_BYTES)} au maximum).` : null);
  }

  return (
    <div className="card mb-0">
      <div className="card-body">
        <h2 className="h6">Importer un fichier</h2>
        <p className="text-muted small">Archive <code>.dump</code> produite par cette page ou par <code>pg_dump -Fc</code>.</p>
        <FormFeedback state={state} />
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
          <label htmlFor="backup-archive" className="visually-hidden">Fichier de sauvegarde</label>
          <input id="backup-archive" name="archive" type="file" accept=".dump,application/octet-stream" required
            className={`form-control${sizeError ? " is-invalid" : ""}`} onChange={handleFileChange}
            aria-describedby={sizeError ? "backup-archive-error" : undefined} />
          {sizeError && <div id="backup-archive-error" className="invalid-feedback d-block">{sizeError}</div>}
          <div>
            <SubmitButton label="Importer" pendingLabel="Envoi…" icon="ri-upload-2-line" isPending={isPending}
              disabled={sizeError !== null} />
          </div>
        </form>
      </div>
    </div>
  );
}
