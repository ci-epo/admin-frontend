import StatsRow from "@/components/sections/admin/dashboard/StatsRow";
import Account from "@/components/sections/admin/dashboard/Account";
import GraphSuivi from "@/components/sections/admin/dashboard/GraphSuivi";
import Transaction from "@/components/sections/admin/dashboard/Transaction";

import {
  createOfficeAssignmentAction,
  deleteOfficeAssignmentAction,
  updateOfficeAssignmentAction,
} from "@/app/(admin)/dashboard/dashboard.actions";
import { loadDashboardStats } from "@/lib/api/dashboard.loader";
import { loadOfficeAssignmentBoard } from "@/lib/api/office-assignment.loader";

export const metadata = {
  title: "Tableau de bord | CIE Admin",
  description: "Vue d'ensemble du club",
};

export default async function DashboardPage() {
  const [stats, board] = await Promise.all([loadDashboardStats(), loadOfficeAssignmentBoard()]);

  return (
    <>
      <StatsRow stats={stats} />

      <Account
        rows={board.rows}
        options={board.options}
        action={createOfficeAssignmentAction}
        updateAction={updateOfficeAssignmentAction}
        deleteAction={deleteOfficeAssignmentAction}
      />

      <div className="row">
        <div className="col-xl-8">
          <GraphSuivi />
        </div>
        <div className="col-xl-4">
          <Transaction />
        </div>
      </div>
    </>
  );
}
