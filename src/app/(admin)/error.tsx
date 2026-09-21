"use client";

import { useEffect } from "react";
import EmptyState from "@/components/ui/empty-state/EmptyState";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  // Le détail technique est journalisé, jamais affiché à l'utilisateur.
  useEffect(() => {
    console.error("[admin] erreur non gérée", error);
  }, [error]);

  return (
    <EmptyState
      className="position-relative z-1"
      icon="ri-error-warning-line"
      title="Une erreur est survenue"
      description="Impossible d'afficher cette page pour le moment. Réessayez dans un instant."
      action={
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={reset}>
          <i className="ri-refresh-line me-1" aria-hidden="true"></i>Réessayer
        </button>
      }
    />
  );
}
