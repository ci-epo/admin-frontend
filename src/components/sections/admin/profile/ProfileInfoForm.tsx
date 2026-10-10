"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Input from "@/components/ui/form/input/Input";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";

interface ProfileInfoFormProps {
  action: FormAction;
  initial: { firstName: string; name: string; phoneNumber: string; email: string };
  /** Faux si aucune fiche membre n'est liée au compte : rien à modifier. */
  canEdit: boolean;
}

export default function ProfileInfoForm({ action, initial, canEdit }: ProfileInfoFormProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const fieldError = (name: string) => (state.status === "error" ? state.fieldErrors?.[name] : undefined);

  return (
    <div className="card h-100">
      <div className="card-header">
        <h2 className="h5 mb-0">Informations personnelles</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <FormFeedback state={state} />
          {!canEdit && (
            <p className="text-muted">Aucune fiche membre n&apos;est liée à votre compte : rien à modifier ici.</p>
          )}
          <fieldset disabled={!canEdit || isPending} className="border-0 p-0 m-0">
            <div className="row">
              <div className="col-12 col-md-6">
                <Input
                  id="profile-first-name"
                  name="firstName"
                  label="Prénom"
                  defaultValue={initial.firstName}
                  autoComplete="given-name"
                  error={fieldError("firstName")}
                  wrapperClass="mb-3"
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <Input
                  id="profile-name"
                  name="name"
                  label="Nom"
                  defaultValue={initial.name}
                  autoComplete="family-name"
                  error={fieldError("name")}
                  wrapperClass="mb-3"
                  required
                />
              </div>
            </div>
            <Input
              id="profile-phone"
              name="phoneNumber"
              type="tel"
              label="Téléphone"
              placeholder="+22670000000"
              defaultValue={initial.phoneNumber}
              autoComplete="tel"
              error={fieldError("phoneNumber")}
              wrapperClass="mb-3"
              required
            />
            <Input
              id="profile-email"
              name="email"
              type="email"
              label="E-mail (identifiant de connexion)"
              defaultValue={initial.email}
              autoComplete="email"
              error={fieldError("email")}
              wrapperClass="mb-3"
              required
            />
          </fieldset>
          <div className="d-flex justify-content-end mt-2">
            <SubmitButton label="Enregistrer" pendingLabel="Enregistrement…" isPending={isPending} disabled={!canEdit} />
          </div>
        </form>
      </div>
    </div>
  );
}
