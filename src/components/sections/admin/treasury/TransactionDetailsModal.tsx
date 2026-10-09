"use client";

import Modal from "@/components/ui/modal/Modal";
import { formatDateTime } from "@/lib/utils/format-date";
import { formatMontant, formatSolde } from "@/lib/utils/format-currency";
import type { TreasuryTransactionRow } from "@/types/treasury";

interface TransactionDetailsModalProps {
  transaction: TreasuryTransactionRow;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionDetailsModal({ transaction, isOpen, onClose }: TransactionDetailsModalProps) {
  return (
    <Modal title="Détails de l'opération" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <div className="text-start">
        <p className="mb-2">
          <strong>Date :</strong> {formatDateTime(transaction.date)}
        </p>
        <p className="mb-2">
          <strong>Type :</strong> {transaction.type} — {transaction.categoryLabel}
        </p>
        <p className="mb-2">
          <strong>Caisse :</strong> {transaction.accountName}
        </p>
        <p className="mb-2">
          <strong>Contrepartie :</strong> {transaction.operatorName} ({transaction.operatorPhone})
        </p>
        <p className="mb-2">
          <strong>Moyen de paiement :</strong> {transaction.roadLabel}
        </p>
        <p className="mb-2">
          <strong>Objectif :</strong> {transaction.objectif}
        </p>
        <p className="mb-2">
          <strong>Montant :</strong> {formatMontant(transaction.montant)}
        </p>
        <p className="mb-0">
          <strong>Solde de la caisse après cette opération :</strong> {formatSolde(transaction.soldeApres)}
        </p>
      </div>
      <div className="d-flex justify-content-end mt-3">
        <button type="button" className="btn btn-light" onClick={onClose}>
          Fermer
        </button>
      </div>
    </Modal>
  );
}
