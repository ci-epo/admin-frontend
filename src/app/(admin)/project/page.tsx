import EmptyState from "@/components/ui/empty-state/EmptyState";

export const metadata = {
  title: "Projets | CIE Admin",
  description: "Suivi des projets du club",
};

export default function ProjectPage() {
  return (
    <EmptyState
      className="position-relative z-1"
      icon="ri-folder-chart-line"
      title="Aucun projet pour le moment"
      description="Le suivi des projets du club sera bientôt disponible."
    />
  );
}
