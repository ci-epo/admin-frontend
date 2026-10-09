import BackupRowActions from "@/components/sections/admin/administration/BackupRowActions";
import StatusBadge from "@/components/ui/badge/StatusBadge";
import EmptyState from "@/components/ui/empty-state/EmptyState";
import { BACKUP_ORIGIN_LABELS } from "@/lib/mappers/backup.mapper";
import { formatBytes } from "@/lib/utils/format-bytes";
import { formatDateTime } from "@/lib/utils/format-date";
import type { FormAction } from "@/types/administration";
import type { Backup, BackupOrigin } from "@/types/backup";

const ORIGIN_TONES: Record<BackupOrigin, "primary" | "warning" | "info"> = {
  manual: "primary",
  "pre-restore": "warning",
  import: "info",
};

interface BackupTableProps {
  backups: Backup[];
  restoreAction: FormAction;
  deleteAction: FormAction;
}

export default function BackupTable({ backups, restoreAction, deleteAction }: BackupTableProps) {
  if (backups.length === 0) {
    return (
      <EmptyState
        icon="ri-database-2-line"
        title="Aucune sauvegarde"
        description="Créez une première sauvegarde de la base, ou importez un fichier .dump."
      />
    );
  }

  return (
    <div className="card h-100">
      <div className="card-header">
        <h2 className="h6 mb-0">Sauvegardes disponibles ({backups.length})</h2>
      </div>
      <div className="card-body">
        <div className="table-box table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light border-0">
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Origine</th>
                <th scope="col">Taille</th>
                <th scope="col" className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr key={backup.name}>
                  <td>
                    <div className="fw-medium">{formatDateTime(backup.createdAt)}</div>
                    <small className="text-muted text-break">{backup.name}</small>
                  </td>
                  <td>
                    <StatusBadge label={BACKUP_ORIGIN_LABELS[backup.origin]} tone={ORIGIN_TONES[backup.origin]} />
                  </td>
                  <td className="text-nowrap">{formatBytes(backup.sizeBytes)}</td>
                  <td className="text-end">
                    <BackupRowActions backup={backup} restoreAction={restoreAction} deleteAction={deleteAction} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
