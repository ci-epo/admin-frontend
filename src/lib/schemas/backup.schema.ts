import { asObject, invalidResponse, readNumber, readString } from "@/lib/schemas/guards";
import type { BackupDto, RestoreBackupDto } from "@/types/backup";

/** Même format que l'API : tout autre nom est refusé avant d'être transmis (aucun chemin arbitraire). */
const BACKUP_NAME_PATTERN = /^cie-\d{8}-\d{6}-(manual|pre-restore|import)-[A-Za-z0-9_-]{8}\.dump$/;

/** Mot à saisir pour confirmer une restauration (elle remplace toute la base). */
export const RESTORE_CONFIRMATION_WORD = "RESTAURER";

export function isBackupName(value: unknown): value is string {
  return typeof value === "string" && BACKUP_NAME_PATTERN.test(value);
}

export function parseBackupDto(value: unknown): BackupDto {
  const what = "backup";
  const source = asObject(value, what);
  return {
    name: readString(source, "name", what),
    origin: readString(source, "origin", what),
    createdAt: readString(source, "createdAt", what),
    sizeBytes: readNumber(source, "sizeBytes", what),
  };
}

export function parseBackupListDto(value: unknown): BackupDto[] {
  if (!Array.isArray(value)) throw invalidResponse("backups", value);
  return value.map(parseBackupDto);
}

export function parseRestoreBackupDto(value: unknown): RestoreBackupDto {
  const source = asObject(value, "restore");
  return { restored: parseBackupDto(source.restored), safetyBackup: parseBackupDto(source.safetyBackup) };
}

/**
 * Taille maximale d'un fichier importé depuis la page (les Server Actions reçoivent le fichier entier) : à garder
 * égale à `experimental.serverActions.bodySizeLimit` de next.config.ts. Au-delà, restaurer en ligne de commande.
 */
export const BACKUP_UPLOAD_MAX_BYTES = 64 * 1024 * 1024;
