import Image from "next/image";
import RowActions from "@/components/ui/dropdown/RowActions";
import StatusBadge from "@/components/ui/badge/StatusBadge";
import type { Member, MemberStatus, MemberType } from "@/types/member";

interface MemberRowProps {
  member: Member;
}

const TYPE_CHIP_CLASS: Record<MemberType, string> = {
  Membre: "member-type-chip--membre",
  Bureau: "member-type-chip--bureau",
  Partenaire: "member-type-chip--partenaire",
  Visiteur: "member-type-chip--visiteur",
};

const STATUS_TONE: Record<MemberStatus, "success" | "secondary"> = {
  Actif: "success",
  Inactif: "secondary",
};

const MEMBER_ACTIONS = [
  { label: "Voir", icon: "ri-eye-line" },
  { label: "Modifier", icon: "ri-pencil-line" },
  { label: "Changer le statut", icon: "ri-user-settings-line" },
];

function MemberTypeChip({ type }: { type: MemberType }) {
  return (
    <span className={`member-type-chip ${TYPE_CHIP_CLASS[type]}`}>
      <i className="member-type-chip-icon ri-price-tag-3-line" aria-hidden></i>
      {type}
    </span>
  );
}

export default function MemberRow({ member }: MemberRowProps) {
  return (
    <tr>
      <td>
        <div className="d-flex align-items-center gap-2">
          {member.avatarUrl && (
            <Image
              src={member.avatarUrl}
              width={24}
              height={24}
              className="avatar-sm rounded-2"
              alt=""
            />
          )}
          <span className="fw-medium">{member.nom}</span>
        </div>
      </td>
      <td className="text-muted">{member.contact}</td>
      <td>
        <MemberTypeChip type={member.type} />
      </td>
      <td>
        <StatusBadge
          label={member.status}
          tone={STATUS_TONE[member.status]}
          className="member-status-badge"
        />
      </td>
      <td className="text-nowrap text-muted">{member.date}</td>
      <td className="text-end">
        <RowActions actions={MEMBER_ACTIONS} />
      </td>
    </tr>
  );
}
