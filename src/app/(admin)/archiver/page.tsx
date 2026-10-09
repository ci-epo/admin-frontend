import { notFound } from "next/navigation";
import { isModuleDisabled } from "@/lib/api/administration.endpoints";
import EmptyState from "@/components/ui/empty-state/EmptyState";

export const metadata = {
  title: "Archives | CIE Admin",
  description: "Consultation et gestion des archives du club",
};

export default async function ArchivesPage() {
  // Module désactivé depuis la page Administration : introuvable, même par son URL.
  if (await isModuleDisabled("archiver")) notFound();

  // Aucune archive n'est stockée côté app-service pour l'instant : pas de faux documents affichés.
  return (
    <EmptyState
      className="position-relative z-1"
      icon="ri-archive-line"
      title="Aucune archive pour le moment"
      description="La consultation des archives du club sera bientôt disponible."
    />
  );
}
