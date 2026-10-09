import { invalidResponse } from "@/lib/schemas/guards";
import type { Backup, BackupDto, BackupOrigin, RestoreBackupDto, RestoreBackupResult } from "@/types/backup";

const ORIGINS: readonly BackupOrigin[] = ["manual", "pre-restore", "import"];

export const BACKUP_ORIGIN_LABELS: Record<BackupOrigin, string> = {
  manual: "Manuelle",
  "pre-restore": "Avant restauration",
  import: "Importée",
};

export function toBackup(dto: BackupDto): Backup {
  const origin = ORIGINS.find((candidate) => candidate === dto.origin);
  if (!origin) throw invalidResponse("backup.origin", dto.origin);
  return { name: dto.name, origin, createdAt: new Date(dto.createdAt), sizeBytes: dto.sizeBytes };
}

export function toRestoreBackupResult(dto: RestoreBackupDto): RestoreBackupResult {
  return { restored: toBackup(dto.restored), safetyBackup: toBackup(dto.safetyBackup) };
}
