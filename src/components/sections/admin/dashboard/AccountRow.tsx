import OfficeAssignmentRowActions from "@/components/sections/admin/dashboard/OfficeAssignmentRowActions";
import StatusBadge from "@/components/ui/badge/StatusBadge";
import type { FormAction } from "@/types/administration";
import type { OfficeAssignmentFormOptions, OfficeAssignmentRow } from "@/types/office-assignment";

interface AccountRowProps {
  row: OfficeAssignmentRow;
  options: OfficeAssignmentFormOptions;
  updateAction: FormAction;
  deleteAction: FormAction;
}

export default function AccountRow({ row, options, updateAction, deleteAction }: AccountRowProps) {
  return (
    <tr>
      <td>{row.positionName}</td>
      <td>{row.memberName}</td>
      <td>{row.phoneNumber}</td>
      <td>
        <StatusBadge label={row.active ? "Actif" : "Inactif"} tone={row.active ? "success" : "secondary"} />
      </td>
      <td>{row.mandateLabel}</td>
      <td className="text-end">
        <OfficeAssignmentRowActions
          row={row}
          options={options}
          updateAction={updateAction}
          deleteAction={deleteAction}
        />
      </td>
    </tr>
  );
}
