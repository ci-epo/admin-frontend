import TreasuryTransactionRowActions from "@/components/sections/admin/treasury/TreasuryTransactionRowActions";
import StatusBadge from "@/components/ui/badge/StatusBadge";
import { formatDate } from "@/lib/utils/format-date";
import { formatMontant, formatSolde } from "@/lib/utils/format-currency";
import type { FormAction } from "@/types/administration";
import type { TreasuryTransactionRow as TreasuryTransactionRowData, TreasuryTransactionType } from "@/types/treasury";

interface TreasuryTransactionRowProps {
  transaction: TreasuryTransactionRowData;
  deleteAction: FormAction;
}

const TYPE_TONE: Record<TreasuryTransactionType, "success" | "danger"> = {
  Entrée: "success",
  Dépense: "danger",
};

export default function TreasuryTransactionRow({ transaction: trx, deleteAction }: TreasuryTransactionRowProps) {
  return (
    <tr>
      <td className="text-nowrap text-muted">{formatDate(trx.date)}</td>
      <td>
        <StatusBadge label={trx.type} tone={TYPE_TONE[trx.type]} />
      </td>
      <td className="fw-medium">{trx.operatorName}</td>
      <td className="text-muted">{trx.operatorPhone}</td>
      <td className="treasury-objectif-cell">{trx.objectif}</td>
      <td className={`text-end fw-semibold text-nowrap ${trx.montant >= 0 ? "text-success" : "text-danger"}`}>
        {formatMontant(trx.montant)}
      </td>
      <td className="text-end text-nowrap">
        <div className="d-flex flex-column">
          <span className="fw-medium">{formatSolde(trx.soldeApres)}</span>
          <span className="text-muted small">{trx.accountName}</span>
        </div>
      </td>
      <td className="text-end">
        <TreasuryTransactionRowActions transaction={trx} deleteAction={deleteAction} />
      </td>
    </tr>
  );
}
