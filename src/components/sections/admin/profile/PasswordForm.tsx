"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Input from "@/components/ui/form/input/Input";
import { useActionForm } from "@/hooks/use-action-form";
import { MEMBER_PASSWORD_RULE } from "@/lib/schemas/member.schema";
import type { FormAction } from "@/types/administration";

export default function PasswordForm({ action }: { action: FormAction }) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fieldError = (name: string) => (state.status === "error" ? state.fieldErrors?.[name] : undefined);

  // Après un changement réussi, on ne garde aucun mot de passe dans les champs, et on ouvre le reste de l'espace admin.
  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="card h-100">
      <div className="card-header">
        <h2 className="h5 mb-0">Mot de passe</h2>
      </div>
      <div className="card-body">
        <p className="text-muted fs-13">
          Si vous vous connectez avec le mot de passe provisoire reçu à votre prise de poste (« bureau » suivi de
          l&apos;année du mandat), changez-le ici.
        </p>
        <form ref={formRef} onSubmit={handleSubmit}>
          <FormFeedback state={state} />
          <fieldset disabled={isPending} className="border-0 p-0 m-0">
            <Input
              id="profile-current-password"
              name="currentPassword"
              type="password"
              label="Mot de passe actuel"
              autoComplete="current-password"
              error={fieldError("currentPassword")}
              wrapperClass="mb-3"
              required
            />
            <Input
              id="profile-new-password"
              name="newPassword"
              type="password"
              label="Nouveau mot de passe"
              autoComplete="new-password"
              error={fieldError("newPassword")}
              wrapperClass="mb-1"
              required
            />
            <div className="form-text mb-3">{MEMBER_PASSWORD_RULE}</div>
            <Input
              id="profile-confirm-password"
              name="confirmPassword"
              type="password"
              label="Confirmer le nouveau mot de passe"
              autoComplete="new-password"
              error={fieldError("confirmPassword")}
              wrapperClass="mb-3"
              required
            />
          </fieldset>
          <div className="d-flex justify-content-end mt-2">
            <SubmitButton
              label="Changer le mot de passe"
              pendingLabel="Modification…"
              icon="ri-lock-password-line"
              isPending={isPending}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
