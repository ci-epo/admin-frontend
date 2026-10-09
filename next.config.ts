import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Import d'une sauvegarde depuis la page Administration (fichier envoyé à une Server Action).
      // Garder égal à BACKUP_UPLOAD_MAX_BYTES (src/lib/schemas/backup.schema.ts).
      bodySizeLimit: "64mb",
    },
  },
};

export default nextConfig;
