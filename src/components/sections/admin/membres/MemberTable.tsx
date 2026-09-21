"use client";

import MemberRow from "@/components/sections/admin/membres/MemberRow";
import TableFooter from "@/components/ui/table/TableFooter";
import TableToolbar from "@/components/ui/table/TableToolbar";
import { usePagination } from "@/hooks/use-pagination";
import type { Member } from "@/types/member";

interface MemberTableProps {
  members: Member[];
}

const FILTERS = [
  { label: "Type", options: ["Tous", "Membre", "Bureau", "Partenaire", "Visiteur"] },
  { label: "Statut", options: ["Tous", "Actif", "Inactif"] },
];

const PAGE_SIZE = 8;

export default function MemberTable({ members }: MemberTableProps) {
  const { items, page, totalPages, from, to, total, setPage } = usePagination(
    members,
    PAGE_SIZE,
  );

  return (
    <div className="row position-relative z-1">
      <div className="col-12">
        <div className="card">
          <TableToolbar title="Liste de membre & partenaire" filters={FILTERS} />
          <div className="card-body">
            <div className="table-box table-responsive">
              <table className="table table-hover align-middle member-table">
                <thead className="table-light border-0">
                  <tr>
                    <th>Nom</th>
                    <th>Contact</th>
                    <th>Type</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th className="text-end"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((member) => (
                    <MemberRow key={member.id} member={member} />
                  ))}
                </tbody>
              </table>
            </div>

            <TableFooter
              from={from}
              to={to}
              total={total}
              emptyLabel="Aucun membre"
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
