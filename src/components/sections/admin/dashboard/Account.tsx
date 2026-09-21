"use client";

import AccountRow from "@/components/sections/admin/dashboard/AccountRow";
import TableFooter from "@/components/ui/table/TableFooter";
import TableToolbar from "@/components/ui/table/TableToolbar";
import { usePagination } from "@/hooks/use-pagination";
import type { Order } from "@/types/dashboard";

interface AccountProps {
  orders: Order[];
}

const FILTERS = [{ label: "Filtre", options: ["Actuel bureau", "Ancien bureau"] }];
const PAGE_SIZE = 5;

export default function Account({ orders }: AccountProps) {
  const { items, page, totalPages, from, to, total, setPage } = usePagination(
    orders,
    PAGE_SIZE,
  );

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <TableToolbar title="Comptes Admin" filters={FILTERS} size="md" />
          <div className="card-body">
            <div className="table-box table-responsive">
              <table className="table table-hover text-nowrap">
                <thead className="table-light border-0">
                  <tr>
                    <th>Poste</th>
                    <th>Telephone</th>
                    <th>Classe</th>
                    <th>Statut</th>
                    <th>Annee</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((order) => (
                    <AccountRow key={order.id} order={order} />
                  ))}
                </tbody>
              </table>
            </div>

            <TableFooter
              from={from}
              to={to}
              total={total}
              emptyLabel="Aucun résultat"
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
