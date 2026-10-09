/** Réponse de `GET /backups` (app-service), un élément. */
export type BackupDto = {
  name: string;
  origin: string;
  createdAt: string;
  sizeBytes: number;
};

export type RestoreBackupDto = {
  restored: BackupDto;
  safetyBackup: BackupDto;
};

/** `manual` : bouton « Sauvegarder » ; `pre-restore` : prise avant une restauration ; `import` : fichier envoyé. */
export type BackupOrigin = "manual" | "pre-restore" | "import";

export interface Backup {
  name: string;
  origin: BackupOrigin;
  createdAt: Date;
  sizeBytes: number;
}

export interface RestoreBackupResult {
  restored: Backup;
  safetyBackup: Backup;
}
