"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import { formatMontant } from "@/lib/utils/format-currency";
import type { FormAction } from "@/types/administration";
import type { TreasuryTransactionRow } from "@/types/treasury";

interface DeleteTransactionDialogProps {
  transaction: TreasuryTransactionRow;
  action: FormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteTransactionDialog({ transaction, action, isOpen, onClose }: DeleteTransactionDialogProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);

  return (
    <Modal title="Supprimer cette opération ?" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <form onSubmit={handleSubmit} className="text-start">
        <input type="hidden" name="publicId" value={transaction.publicId} />
        <FormFeedback state={state} />
        <p>
          <strong>{transaction.objectif}</strong> ({formatMontant(transaction.montant)}, {transaction.operatorName})
          sera définitivement retirée du journal. Le solde de la caisse « {transaction.accountName} » sera ajusté en
          conséquence.
        </p>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={isPending}>
            Annuler
          </button>
          <SubmitButton
            label="Supprimer"
            pendingLabel="Suppression…"
            icon="ri-delete-bin-line"
            variant="danger"
            isPending={isPending}
          />
        </div>
      </form>
    </Modal>
  );
}
