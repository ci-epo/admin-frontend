import { notFound } from "next/navigation";
import { isModuleDisabled } from "@/lib/api/administration.endpoints";
import { getCurrentAccess, hasPermission } from "@/lib/auth/current-access";
import { loadTreasuryBoard } from "@/lib/api/treasury.loader";
import TreasuryStatsRow from "@/components/sections/admin/treasury/TreasuryStatsRow";
import TreasuryTransactionTable from "@/components/sections/admin/treasury/TreasuryTransactionTable";
import { createTransactionAction, deleteTransactionAction } from "@/app/(admin)/treasury/treasury.actions";

export const metadata = {
  title: "Trésorerie | CIE Admin",
  description: "Suivi de la caisse, des entrées et des dépenses du club",
};

export default async function TreasuryPage() {
  // Module désactivé depuis la page Administration, ou poste sans la permission `page:treasury` : introuvable.
  if (await isModuleDisabled("treasury")) notFound();
  if (!hasPermission(await getCurrentAccess(), "page:treasury")) notFound();

  const board = await loadTreasuryBoard();

  return (
    <>
      <TreasuryStatsRow stats={board.stats} />

      <TreasuryTransactionTable
        rows={board.rows}
        options={board.options}
        createAction={createTransactionAction}
        deleteAction={deleteTransactionAction}
      />
    </>
  );
}
