"use client";

import { useState } from "react";
import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Input from "@/components/ui/form/input/Input";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import { RESTORE_CONFIRMATION_WORD } from "@/lib/schemas/backup.schema";
import { formatDateTime } from "@/lib/utils/format-date";
import type { FormAction } from "@/types/administration";
import type { Backup } from "@/types/backup";

interface BackupRestoreDialogProps {
  backup: Backup;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

/** Restauration : action destructrice, confirmée en saisissant un mot (un simple clic ne suffit pas). */
export default function BackupRestoreDialog({ backup, action, isOpen, onClose }: BackupRestoreDialogProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const [confirmation, setConfirmation] = useState("");
  const isDone = state.status === "success";
  const confirmationError = state.status === "error" ? state.fieldErrors?.confirmation : undefined;

  return (
    <Modal title="Restaurer cette sauvegarde ?" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <input type="hidden" name="name" value={backup.name} />
        <FormFeedback state={state} />
        {!isDone && (
          <>
            <p>
              Toute la base (membres, activités, trésorerie, comptes, paramètres…) sera remplacée par son état du{" "}
              <strong>{formatDateTime(backup.createdAt)}</strong>. Les modifications faites depuis seront perdues.
            </p>
            <p className="text-muted small">
              Une sauvegarde de l&apos;état actuel est créée automatiquement juste avant : on peut revenir en arrière.
            </p>
            <Input
              id={`restore-confirmation-${backup.name}`}
              name="confirmation"
              label={`Saisissez ${RESTORE_CONFIRMATION_WORD} pour confirmer`}
              autoComplete="off"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              error={confirmationError}
            />
          </>
        )}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={isPending}>
            {isDone ? "Fermer" : "Annuler"}
          </button>
          {!isDone && (
            <SubmitButton
              label="Restaurer"
              pendingLabel="Restauration…"
              icon="ri-history-line"
              variant="warning"
              isPending={isPending}
              disabled={confirmation.trim() !== RESTORE_CONFIRMATION_WORD}
            />
          )}
        </div>
      </form>
    </Modal>
  );
}
