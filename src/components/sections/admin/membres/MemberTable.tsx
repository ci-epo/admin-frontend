"use client";

import { useMemo, useState } from "react";
import AddMemberModal from "@/components/sections/admin/membres/AddMemberModal";
import MemberRow, { TYPE_LABEL } from "@/components/sections/admin/membres/MemberRow";
import TableFooter from "@/components/ui/table/TableFooter";
import TableToolbar from "@/components/ui/table/TableToolbar";
import { usePagination } from "@/hooks/use-pagination";
import { filterBySearch } from "@/lib/utils/text-search";
import type { FormAction } from "@/types/administration";
import type { MemberRow as MemberRowData } from "@/types/member";

interface MemberTableProps {
  rows: MemberRowData[];
  createAction: FormAction;
  updateAction: FormAction;
  deleteAction: FormAction;
}

const PAGE_SIZE = 20;
const TOUS = "Tous";
const TYPE_FILTER_OPTIONS = [TOUS, ...Object.values(TYPE_LABEL)];

/** Champs sur lesquels porte la recherche : nom, contact, et le type affiché. */
function searchableFields(member: MemberRowData): string[] {
  return [member.firstName, member.name, member.phoneNumber, member.email, TYPE_LABEL[member.displayType]];
}

export default function MemberTable({ rows, createAction, updateAction, deleteAction }: MemberTableProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>(TOUS);

  const filteredRows = useMemo(() => {
    const searched = filterBySearch(rows, query, searchableFields);
    if (typeFilter === TOUS) return searched;
    return searched.filter((member) => TYPE_LABEL[member.displayType] === typeFilter);
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
            title="Liste des membres et partenaires"
            onAdd={() => setIsAddOpen(true)}
            searchPlaceholder="Rechercher un membre..."
            searchValue={query}
            onSearchChange={handleSearchChange}
            filters={[
              { label: "Type", options: TYPE_FILTER_OPTIONS, value: typeFilter, onChange: handleTypeFilterChange },
            ]}
          />
          <div className="card-body">
            <div className="table-box">
              <table className="table table-hover align-middle member-table">
                <thead className="table-light border-0">
                  <tr>
                    <th>Nom</th>
                    <th>Contact</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th className="text-end"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((member) => (
                    <MemberRow
                      key={member.publicId}
                      member={member}
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
              emptyLabel={rows.length > 0 ? `Aucun résultat pour « ${query.trim()} »` : "Aucun membre enregistré"}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>

      <AddMemberModal action={createAction} isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
