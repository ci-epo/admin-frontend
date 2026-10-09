"use client";

import { useMemo, useState } from "react";
import AccountRow from "@/components/sections/admin/dashboard/AccountRow";
import AddOfficeAssignmentModal from "@/components/sections/admin/dashboard/AddOfficeAssignmentModal";
import TableFooter from "@/components/ui/table/TableFooter";
import TableToolbar from "@/components/ui/table/TableToolbar";
import { usePagination } from "@/hooks/use-pagination";
import { filterBySearch } from "@/lib/utils/text-search";
import type { FormAction } from "@/types/administration";
import type { OfficeAssignmentFormOptions, OfficeAssignmentRow } from "@/types/office-assignment";

interface AccountProps {
  rows: OfficeAssignmentRow[];
  options: OfficeAssignmentFormOptions;
  action: FormAction;
  updateAction: FormAction;
  deleteAction: FormAction;
}

const PAGE_SIZE = 12;

/** Champs sur lesquels porte la recherche : toutes les colonnes affichées, statut compris. */
function searchableFields(row: OfficeAssignmentRow): string[] {
  return [row.positionName, row.memberName, row.phoneNumber, row.mandateLabel, row.active ? "Actif" : "Inactif"];
}

export default function Account({ rows, options, action, updateAction, deleteAction }: AccountProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filteredRows = useMemo(() => filterBySearch(rows, query, searchableFields), [rows, query]);
  const { items, page, totalPages, from, to, total, setPage } = usePagination(filteredRows, PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <TableToolbar
            title="Comptes Admin"
            onAdd={() => setIsAddOpen(true)}
            searchPlaceholder="Rechercher un poste, un membre..."
            searchValue={query}
            onSearchChange={handleSearchChange}
            size="md"
          />
          <div className="card-body">
            <div className="table-box table-responsive">
              <table className="table table-hover text-nowrap">
                <thead className="table-light border-0">
                  <tr>
                    <th>Poste</th>
                    <th>Membre</th>
                    <th>Telephone</th>
                    <th>Statut</th>
                    <th>Mandat</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <AccountRow
                      key={row.publicId}
                      row={row}
                      options={options}
                      updateAction={updateAction}
                      deleteAction={deleteAction}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <TableFooter
              from={from}
              to={to}
              total={total}
              emptyLabel={
                rows.length > 0 ? `Aucun résultat pour « ${query.trim()} »` : "Aucune affectation enregistrée"
              }
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>

      <AddOfficeAssignmentModal
        options={options}
        action={action}
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </div>
  );
}
