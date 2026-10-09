"use client";

import Alert from "@/components/ui/alert/Alert";
import Input from "@/components/ui/form/input/Input";
import Spinner from "@/components/ui/spinner/Spinner";
import { useActionForm } from "@/hooks/use-action-form";
import type { ActionState } from "@/types/administration";

interface LoginFormProps {
  action: (state: ActionState, form: FormData) => Promise<ActionState>;
}

export default function LoginForm({ action }: LoginFormProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);

  return (
    <div className="row justify-content-center position-relative z-1">
      <div className="col-xl-5 col-lg-7">
        <div className="card">
          <div className="card-body p-4">
            <h2 className="h5 mb-2">
              <i className="ri-shield-keyhole-line me-1 text-primary" aria-hidden="true"></i>Connexion
            </h2>
            <p className="text-muted">Réservée au bureau du club.</p>
            {state.status !== "idle" && (
              <Alert
                variant={state.status === "success" ? "success" : "danger"}
                icon={state.status === "success" ? "ri-checkbox-circle-line" : "ri-error-warning-line"}
                message={state.message}
                className="mb-3"
              />
            )}
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <Input id="login-email" name="email" type="email" label="E-mail" autoComplete="email" required />
              <Input
                id="login-password"
                name="password"
                type="password"
                label="Mot de passe"
                autoComplete="current-password"
                required
              />
              <div>
                <button type="submit" className="btn btn-primary" disabled={isPending} aria-busy={isPending}>
                  {isPending ? (
                    <Spinner size="sm" label="Connexion…" className="me-2 text-white" />
                  ) : (
                    <i className="ri-login-circle-line me-1" aria-hidden="true"></i>
                  )}
                  {isPending ? "Connexion…" : "Se connecter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
