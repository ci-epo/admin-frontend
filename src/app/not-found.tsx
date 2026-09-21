import Link from "next/link";
import EmptyState from "@/components/ui/empty-state/EmptyState";

export const metadata = {
  title: "Page introuvable | CIE Admin",
};

export default function NotFound() {
  return (
    <div className="container py-5">
      <EmptyState
        icon="ri-compass-3-line"
        title="Page introuvable"
        description="La page demandée n'existe pas ou a été déplacée."
        action={
          <Link href="/dashboard" className="btn btn-primary btn-sm">
            Retour au tableau de bord
          </Link>
        }
      />
    </div>
  );
}
