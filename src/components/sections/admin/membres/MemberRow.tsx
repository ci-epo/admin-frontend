import MemberRowActions from "@/components/sections/admin/membres/MemberRowActions";
import { formatDateTime } from "@/lib/utils/format-date";
import type { FormAction } from "@/types/administration";
import type { MemberDisplayType, MemberRow as MemberRowData } from "@/types/member";

interface MemberRowProps {
  member: MemberRowData;
  updateAction: FormAction;
  deleteAction: FormAction;
}

const TYPE_CHIP_CLASS: Record<MemberDisplayType, string> = {
  Membre: "member-type-chip--membre",
  Bureau: "member-type-chip--bureau",
  AncienBureau: "member-type-chip--ancien-bureau",
  Partenaire: "member-type-chip--partenaire",
};

export const TYPE_LABEL: Record<MemberDisplayType, string> = {
  Membre: "Membre",
  Bureau: "Bureau",
  AncienBureau: "Ancien Bureau",
  Partenaire: "Partenaire",
};

function MemberTypeChip({ displayType }: { displayType: MemberDisplayType }) {
  return (
    <span className={`member-type-chip ${TYPE_CHIP_CLASS[displayType]}`}>
      <i className="member-type-chip-icon ri-price-tag-3-line" aria-hidden></i>
      {TYPE_LABEL[displayType]}
    </span>
  );
}

export default function MemberRow({ member, updateAction, deleteAction }: MemberRowProps) {
  return (
    <tr>
      <td>
        <span className="fw-medium">
          {member.firstName} {member.name}
        </span>
      </td>
      <td>
        <div className="d-flex flex-column">
          <span className="text-muted">{member.phoneNumber}</span>
          <span className="text-muted small">{member.email}</span>
        </div>
      </td>
      <td>
        <MemberTypeChip displayType={member.displayType} />
      </td>
      <td className="text-nowrap text-muted">{formatDateTime(member.createdAt)}</td>
      <td className="text-end">
        <MemberRowActions member={member} updateAction={updateAction} deleteAction={deleteAction} />
      </td>
    </tr>
  );
}
