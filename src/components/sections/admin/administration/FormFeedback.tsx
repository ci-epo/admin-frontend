import Alert from "@/components/ui/alert/Alert";
import type { ActionState } from "@/types/administration";

interface FormFeedbackProps {
  state: ActionState;
  className?: string;
}

/** Résultat de la dernière action du formulaire (annoncé aux lecteurs d'écran par `role="alert"`). */
export default function FormFeedback({ state, className = "mb-3" }: FormFeedbackProps) {
  if (state.status === "idle") return null;
  const isSuccess = state.status === "success";
  return (
    <Alert
      variant={isSuccess ? "success" : "danger"}
      icon={isSuccess ? "ri-checkbox-circle-line" : "ri-error-warning-line"}
      message={state.message}
      className={className}
    />
  );
}
