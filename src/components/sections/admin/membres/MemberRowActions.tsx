"use client";

import { useState } from "react";
import DeleteMemberDialog from "@/components/sections/admin/membres/DeleteMemberDialog";
import EditMemberModal from "@/components/sections/admin/membres/EditMemberModal";
import RowActions from "@/components/ui/dropdown/RowActions";
import type { FormAction } from "@/types/administration";
import type { MemberRow } from "@/types/member";

interface MemberRowActionsProps {
  member: MemberRow;
  updateAction: FormAction;
  deleteAction: FormAction;
}

type OpenDialog = "edit" | "delete" | null;

export default function MemberRowActions({ member, updateAction, deleteAction }: MemberRowActionsProps) {
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const close = () => setDialog(null);

  return (
    <>
      <RowActions
        ariaLabel={`Actions pour ${member.firstName} ${member.name}`}
        actions={[
          { label: "Modifier", icon: "ri-pencil-line", onClick: () => setDialog("edit") },
          { label: "Supprimer", icon: "ri-delete-bin-line", onClick: () => setDialog("delete"), danger: true },
        ]}
      />
      {/* Montés à l'ouverture seulement : chaque ouverture repart d'un formulaire vierge. */}
      {dialog === "edit" && <EditMemberModal member={member} action={updateAction} isOpen onClose={close} />}
      {dialog === "delete" && <DeleteMemberDialog member={member} action={deleteAction} isOpen onClose={close} />}
    </>
  );
}
