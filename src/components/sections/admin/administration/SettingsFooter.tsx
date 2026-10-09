import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import { formatDateTime } from "@/lib/utils/format-date";

interface SettingsFooterProps {
  updatedAt: Date | null;
  isPending: boolean;
}

export default function SettingsFooter({ updatedAt, isPending }: SettingsFooterProps) {
  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-4">
      <small className="text-muted">
        {updatedAt ? `Dernier enregistrement : ${formatDateTime(updatedAt)}` : "Valeurs par défaut (jamais enregistrées)"}
      </small>
      <SubmitButton label="Enregistrer" pendingLabel="Enregistrement…" isPending={isPending} />
    </div>
  );
}
