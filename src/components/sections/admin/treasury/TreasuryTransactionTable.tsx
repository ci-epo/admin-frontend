"use client";

import TreasuryTransactionRow from "@/components/sections/admin/treasury/TreasuryTransactionRow";
import TableFooter from "@/components/ui/table/TableFooter";
import TableToolbar from "@/components/ui/table/TableToolbar";
import { usePagination } from "@/hooks/use-pagination";
import type { TreasuryTransaction } from "@/types/treasury";

interface TreasuryTransactionTableProps {
  transactions: TreasuryTransaction[];
}

const FILTERS = [
  { label: "Type", options: ["Toutes", "Entrées", "Dépenses"] },
  { label: "Période", options: ["Ce mois", "Ce trimestre", "Cette année", "Tout"] },
];

const PAGE_SIZE = 8;

export default function TreasuryTransactionTable({
  transactions,
}: TreasuryTransactionTableProps) {
  const { items, page, totalPages, from, to, total, setPage } = usePagination(
    transactions,
    PAGE_SIZE,
  );

  return (
    <div className="row position-relative z-1">
      <div className="col-12">
        <div className="card">
          <TableToolbar
            title="Journal des transactions"
            addLabel="Nouvelle opération"
            filters={FILTERS}
          />
          <div className="card-body">
            <div className="table-box table-responsive">
              <table className="table table-hover align-middle treasury-transactions-table">
                <thead className="table-light border-0">
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Nom</th>
                    <th>Rôle</th>
                    <th>Contact</th>
                    <th>Objectif</th>
                    <th className="text-end">Montant</th>
                    <th className="text-end">Caisse</th>
                    <th className="text-end"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((transaction) => (
                    <TreasuryTransactionRow key={transaction.id} transaction={transaction} />
                  ))}
                </tbody>
              </table>
            </div>

            <TableFooter
              from={from}
              to={to}
              total={total}
              emptyLabel="Aucune transaction"
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
