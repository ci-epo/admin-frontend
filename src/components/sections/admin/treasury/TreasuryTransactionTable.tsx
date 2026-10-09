"use client";

import { useMemo, useState } from "react";
import AddTransactionModal from "@/components/sections/admin/treasury/AddTransactionModal";
import TreasuryTransactionRow from "@/components/sections/admin/treasury/TreasuryTransactionRow";
import TableFooter from "@/components/ui/table/TableFooter";
import TableToolbar from "@/components/ui/table/TableToolbar";
import { usePagination } from "@/hooks/use-pagination";
import { filterBySearch } from "@/lib/utils/text-search";
import type { FormAction } from "@/types/administration";
import type { TreasuryFormOptions, TreasuryTransactionRow as TreasuryTransactionRowData } from "@/types/treasury";

interface TreasuryTransactionTableProps {
  rows: TreasuryTransactionRowData[];
  options: TreasuryFormOptions;
  createAction: FormAction;
  deleteAction: FormAction;
}

const TOUS = "Toutes";
const ENTREES = "Entrées";
const DEPENSES = "Dépenses";
const TYPE_FILTER_OPTIONS = [TOUS, ENTREES, DEPENSES];
const PERIOD_FILTER = { label: "Période", options: ["Ce mois", "Ce trimestre", "Cette année", "Tout"] };

const PAGE_SIZE = 8;

function searchableFields(row: TreasuryTransactionRowData): string[] {
  return [row.operatorName, row.objectif, row.categoryLabel, row.accountName];
}

export default function TreasuryTransactionTable({ rows, options, createAction, deleteAction }: TreasuryTransactionTableProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>(TOUS);

  const filteredRows = useMemo(() => {
    const searched = filterBySearch(rows, query, searchableFields);
    if (typeFilter === TOUS) return searched;
    return searched.filter((row) => (typeFilter === ENTREES ? row.type === "Entrée" : row.type === "Dépense"));
  }, [rows, query, typeFilter]);

  const { items, page, totalPages, from, to, total, setPage } = usePagination(filteredRows, PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleTypeFilterChange = (option: string) => {
    setTypeFilter(option);
    setPage(1);
  };

  return (
    <div className="row position-relative z-1">
      <div className="col-12">
        <div className="card">
          <TableToolbar
            title="Journal des transactions"
            addLabel="Nouvelle opération"
            onAdd={() => setIsAddOpen(true)}
            searchPlaceholder="Rechercher une opération..."
            searchValue={query}
            onSearchChange={handleSearchChange}
            filters={[
              { label: "Type", options: TYPE_FILTER_OPTIONS, value: typeFilter, onChange: handleTypeFilterChange },
              PERIOD_FILTER,
            ]}
          />
          <div className="card-body">
            <div className="table-box table-responsive">
              <table className="table table-hover align-middle treasury-transactions-table">
                <thead className="table-light border-0">
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Nom</th>
                    <th>Contact</th>
                    <th>Objectif</th>
                    <th className="text-end">Montant</th>
                    <th className="text-end">Caisse</th>
                    <th className="text-end"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((transaction) => (
                    <TreasuryTransactionRow key={transaction.publicId} transaction={transaction} deleteAction={deleteAction} />
                  ))}
                </tbody>
              </table>
            </div>

            <TableFooter
              from={from}
              to={to}
              total={total}
              emptyLabel={rows.length > 0 ? `Aucun résultat pour « ${query.trim()} »` : "Aucune transaction"}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>

      <AddTransactionModal action={createAction} options={options} isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
