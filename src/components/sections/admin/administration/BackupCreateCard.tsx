"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";

interface BackupCreateCardProps {
  action: FormAction;
}

export default function BackupCreateCard({ action }: BackupCreateCardProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);

  return (
    <div className="card mb-0">
      <div className="card-body">
        <h2 className="h6">Nouvelle sauvegarde</h2>
        <p className="text-muted small">Copie complète de la base, à cet instant. Le site reste en ligne pendant l&apos;opération.</p>
        <FormFeedback state={state} />
        <form onSubmit={handleSubmit}>
          <SubmitButton label="Sauvegarder maintenant" pendingLabel="Sauvegarde en cours…" icon="ri-save-3-line"
            isPending={isPending} />
        </form>
      </div>
    </div>
  );
}
