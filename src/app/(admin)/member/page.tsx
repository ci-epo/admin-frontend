import { notFound } from "next/navigation";
import { isModuleDisabled } from "@/lib/api/administration.endpoints";
import { loadMemberBoard } from "@/lib/api/member.loader";
import MemberTable from "@/components/sections/admin/membres/MemberTable";
import { createMemberAction, deleteMemberAction, updateMemberAction } from "@/app/(admin)/member/member.actions";

export const metadata = {
  title: "Membres | CIE Admin",
  description: "Gestion des membres et du bureau",
};

export default async function MembresPage() {
  // Module désactivé depuis la page Administration : introuvable, même par son URL.
  if (await isModuleDisabled("member")) notFound();

  const rows = await loadMemberBoard();

  return (
    <MemberTable
      rows={rows}
      createAction={createMemberAction}
      updateAction={updateMemberAction}
      deleteAction={deleteMemberAction}
    />
  );
}
