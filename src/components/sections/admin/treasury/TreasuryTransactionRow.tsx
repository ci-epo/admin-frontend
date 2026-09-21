import RowActions from "@/components/ui/dropdown/RowActions";
import StatusBadge from "@/components/ui/badge/StatusBadge";
import { formatMontant, formatSolde } from "@/lib/utils/format-currency";
import type { TreasuryTransaction, TreasuryTransactionType } from "@/types/treasury";

interface TreasuryTransactionRowProps {
  transaction: TreasuryTransaction;
}

const TYPE_TONE: Record<TreasuryTransactionType, "success" | "danger"> = {
  Entrée: "success",
  Dépense: "danger",
};

const TRANSACTION_ACTIONS = [
  { label: "Détails", icon: "ri-eye-line" },
  { label: "Reçu", icon: "ri-file-download-line" },
];

export default function TreasuryTransactionRow({ transaction: trx }: TreasuryTransactionRowProps) {
  return (
    <tr>
      <td className="text-nowrap text-muted">{trx.date}</td>
      <td>
        <StatusBadge label={trx.type} tone={TYPE_TONE[trx.type]} />
      </td>
      <td className="fw-medium">{trx.nom}</td>
      <td>{trx.role}</td>
      <td className="text-muted">{trx.contact}</td>
      <td className="treasury-objectif-cell">{trx.objectif}</td>
      <td
        className={`text-end fw-semibold text-nowrap ${
          trx.montant >= 0 ? "text-success" : "text-danger"
        }`}
      >
        {formatMontant(trx.montant)}
      </td>
      <td className="text-end fw-medium text-nowrap">{formatSolde(trx.soldeApres)}</td>
      <td className="text-end">
        <RowActions actions={TRANSACTION_ACTIONS} />
      </td>
    </tr>
  );
}
