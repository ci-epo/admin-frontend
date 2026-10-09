"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import { formatDateTime } from "@/lib/utils/format-date";
import type { FormAction } from "@/types/administration";
import type { Backup } from "@/types/backup";

interface BackupDeleteDialogProps {
  backup: Backup;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function BackupDeleteDialog({ backup, action, isOpen, onClose }: BackupDeleteDialogProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);

  return (
    <Modal title="Supprimer cette sauvegarde ?" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <input type="hidden" name="name" value={backup.name} />
        <FormFeedback state={state} />
        <p>
          La sauvegarde du <strong>{formatDateTime(backup.createdAt)}</strong> sera définitivement effacée du serveur.
          Téléchargez-la avant si vous voulez en garder une copie.
        </p>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={isPending}>
            Annuler
          </button>
          <SubmitButton label="Supprimer" pendingLabel="Suppression…" icon="ri-delete-bin-line" variant="danger"
            isPending={isPending} />
        </div>
      </form>
    </Modal>
  );
}
