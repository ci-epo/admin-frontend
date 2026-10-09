import { startTransition, useActionState, type FormEvent } from "react";
import type { ActionState } from "@/types/administration";

const IDLE: ActionState = { status: "idle" };

/**
 * Relie un formulaire à une Server Action. L'envoi passe par `onSubmit` plutôt que par `action` : React
 * réinitialise un formulaire après une `action`, ce qui effacerait la saisie quand l'API la refuse.
 */
export function useActionForm(action: (state: ActionState, form: FormData) => Promise<ActionState>) {
  const [state, dispatch, isPending] = useActionState(action, IDLE);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(() => dispatch(form));
  }

  return { state, isPending, handleSubmit };
}
