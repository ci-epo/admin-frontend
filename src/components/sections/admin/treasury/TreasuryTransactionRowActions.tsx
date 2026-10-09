"use client";

import { useState } from "react";
import DeleteTransactionDialog from "@/components/sections/admin/treasury/DeleteTransactionDialog";
import TransactionDetailsModal from "@/components/sections/admin/treasury/TransactionDetailsModal";
import RowActions from "@/components/ui/dropdown/RowActions";
import type { FormAction } from "@/types/administration";
import type { TreasuryTransactionRow } from "@/types/treasury";

interface TreasuryTransactionRowActionsProps {
  transaction: TreasuryTransactionRow;
  deleteAction: FormAction;
}

type OpenDialog = "details" | "delete" | null;

export default function TreasuryTransactionRowActions({ transaction, deleteAction }: TreasuryTransactionRowActionsProps) {
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const close = () => setDialog(null);

  return (
    <>
      <RowActions
        ariaLabel={`Actions pour l'opération « ${transaction.objectif} »`}
        actions={[
          { label: "Détails", icon: "ri-eye-line", onClick: () => setDialog("details") },
          { label: "Supprimer", icon: "ri-delete-bin-line", onClick: () => setDialog("delete"), danger: true },
        ]}
      />
      {dialog === "details" && <TransactionDetailsModal transaction={transaction} isOpen onClose={close} />}
      {dialog === "delete" && (
        <DeleteTransactionDialog transaction={transaction} action={deleteAction} isOpen onClose={close} />
      )}
    </>
  );
}
