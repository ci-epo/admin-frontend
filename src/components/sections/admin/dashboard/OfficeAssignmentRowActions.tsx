"use client";

import { useState } from "react";
import DeleteOfficeAssignmentDialog from "@/components/sections/admin/dashboard/DeleteOfficeAssignmentDialog";
import EditOfficeAssignmentModal from "@/components/sections/admin/dashboard/EditOfficeAssignmentModal";
import RowActions from "@/components/ui/dropdown/RowActions";
import type { FormAction } from "@/types/administration";
import type { OfficeAssignmentFormOptions, OfficeAssignmentRow } from "@/types/office-assignment";

interface OfficeAssignmentRowActionsProps {
  row: OfficeAssignmentRow;
  options: OfficeAssignmentFormOptions;
  updateAction: FormAction;
  deleteAction: FormAction;
}

type OpenDialog = "edit" | "delete" | null;

export default function OfficeAssignmentRowActions({
  row,
  options,
  updateAction,
  deleteAction,
}: OfficeAssignmentRowActionsProps) {
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const close = () => setDialog(null);

  return (
    <>
      <RowActions
        ariaLabel={`Actions pour ${row.memberName}`}
        actions={[
          { label: "Modifier", icon: "ri-pencil-line", onClick: () => setDialog("edit") },
          { label: "Supprimer", icon: "ri-delete-bin-line", onClick: () => setDialog("delete"), danger: true },
        ]}
      />
      {/* Montés à l'ouverture seulement : chaque ouverture repart d'un formulaire vierge. */}
      {dialog === "edit" && (
        <EditOfficeAssignmentModal row={row} options={options} action={updateAction} isOpen onClose={close} />
      )}
      {dialog === "delete" && <DeleteOfficeAssignmentDialog row={row} action={deleteAction} isOpen onClose={close} />}
    </>
  );
}
