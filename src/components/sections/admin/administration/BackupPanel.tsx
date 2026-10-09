import BackupCreateCard from "@/components/sections/admin/administration/BackupCreateCard";
import BackupHelp from "@/components/sections/admin/administration/BackupHelp";
import BackupImportCard from "@/components/sections/admin/administration/BackupImportCard";
import BackupTable from "@/components/sections/admin/administration/BackupTable";
import type { FormAction } from "@/types/administration";
import type { Backup } from "@/types/backup";

export interface BackupActions {
  create: FormAction;
  import: FormAction;
  restore: FormAction;
  delete: FormAction;
}

interface BackupPanelProps {
  backups: Backup[];
  actions: BackupActions;
}

export default function BackupPanel({ backups, actions }: BackupPanelProps) {
  return (
    <div className="row g-4 position-relative z-1">
      <div className="col-xxl-8">
        <BackupTable backups={backups} restoreAction={actions.restore} deleteAction={actions.delete} />
      </div>
      <div className="col-xxl-4 d-flex flex-column gap-4">
        <BackupCreateCard action={actions.create} />
        <BackupImportCard action={actions.import} />
        <BackupHelp />
      </div>
    </div>
  );
}
