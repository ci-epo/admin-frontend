"use client";

import { useState } from "react";
import BackupDeleteDialog from "@/components/sections/admin/administration/BackupDeleteDialog";
import BackupRestoreDialog from "@/components/sections/admin/administration/BackupRestoreDialog";
import type { FormAction } from "@/types/administration";
import type { Backup } from "@/types/backup";

interface BackupRowActionsProps {
  backup: Backup;
  restoreAction: FormAction;
  deleteAction: FormAction;
}

type OpenDialog = "restore" | "delete" | null;

export default function BackupRowActions({ backup, restoreAction, deleteAction }: BackupRowActionsProps) {
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const close = () => setDialog(null);

  return (
    <>
      <div className="d-inline-flex flex-wrap justify-content-end gap-2">
        {/* Route Handler de l'admin : relaie l'archive d'app-service avec le jeton de la session. */}
        <a className="btn btn-sm btn-light-primary" href={`/api/backups/${encodeURIComponent(backup.name)}`} download>
          <i className="ri-download-2-line me-1" aria-hidden="true"></i>Télécharger
        </a>
        <button type="button" className="btn btn-sm btn-light-warning" onClick={() => setDialog("restore")}>
          <i className="ri-history-line me-1" aria-hidden="true"></i>Restaurer
        </button>
        <button type="button" className="btn btn-sm btn-light-danger" onClick={() => setDialog("delete")}
          aria-label={`Supprimer la sauvegarde du ${backup.createdAt.toISOString().slice(0, 10)}`}>
          <i className="ri-delete-bin-line" aria-hidden="true"></i>
        </button>
      </div>
      {/* Montés à l'ouverture seulement : chaque ouverture repart d'un formulaire vierge. */}
      {dialog === "restore" && <BackupRestoreDialog backup={backup} action={restoreAction} isOpen onClose={close} />}
      {dialog === "delete" && <BackupDeleteDialog backup={backup} action={deleteAction} isOpen onClose={close} />}
    </>
  );
}
