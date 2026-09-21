import Image from "next/image";
import RowActions from "@/components/ui/dropdown/RowActions";
import StatusBadge from "@/components/ui/badge/StatusBadge";
import type { Order, OrderStatus } from "@/types/dashboard";

interface AccountRowProps {
  order: Order;
}

const STATUS_TONE: Record<OrderStatus, "success" | "secondary"> = {
  Actif: "success",
  Inactif: "secondary",
};

const ACCOUNT_ACTIONS = [
  { label: "Modifier" },
  { label: "Voir" },
  { label: "Changer le statut" },
];

export default function AccountRow({ order }: AccountRowProps) {
  return (
    <tr>
      <td>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            defaultChecked={order.checked}
            aria-label={`Sélectionner ${order.id}`}
          />
          <Image
            src={order.avatarUrl}
            width={24}
            height={24}
            className="avatar-sm rounded-2 mx-2"
            alt=""
          />
          {order.id}
        </div>
      </td>
      <td>{order.email}</td>
      <td>{order.product}</td>
      <td>
        <StatusBadge label={order.status} tone={STATUS_TONE[order.status]} />
      </td>
      <td>{order.tracking}</td>
      <td>
        <RowActions actions={ACCOUNT_ACTIONS} />
      </td>
    </tr>
  );
}
