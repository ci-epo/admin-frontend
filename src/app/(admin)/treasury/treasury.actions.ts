"use server";

import { revalidatePath } from "next/cache";
import { createOperator, createTransaction, deleteTransaction } from "@/lib/api/treasury.endpoints";
import { toTreasuryErrorMessage, toTreasuryFieldErrors } from "@/lib/mappers/treasury-error.mapper";
import { parseCreateTransactionForm, parseOperatorForm } from "@/lib/schemas/treasury.schema";
import type { ActionState } from "@/types/administration";

/**
 * L'opérateur (contrepartie de l'opération : nom + téléphone) n'a pas d'écran de gestion dédié : il est créé à la
 * volée ici, puis référencé par la transaction. Si la création de la transaction échoue ensuite, l'opérateur créé
 * reste orphelin (compromis accepté, cf. décision côté admin-frontend).
 */
export async function createTransactionAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const parsedOperator = parseOperatorForm(form);
  if (!parsedOperator.ok) {
    return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsedOperator.fieldErrors };
  }

  let operatorId: string;
  try {
    operatorId = (await createOperator(parsedOperator.data)).publicId;
  } catch (error) {
    return { status: "error", message: toTreasuryErrorMessage(error), fieldErrors: toTreasuryFieldErrors(error) };
  }

  const parsedTransaction = parseCreateTransactionForm(form, operatorId);
  if (!parsedTransaction.ok) {
    return { status: "error", message: "Corrigez les champs signalés.", fieldErrors: parsedTransaction.fieldErrors };
  }

  try {
    await createTransaction(parsedTransaction.data);
  } catch (error) {
    return { status: "error", message: toTreasuryErrorMessage(error), fieldErrors: toTreasuryFieldErrors(error) };
  }

  revalidatePath("/treasury");
  return { status: "success", message: "Opération ajoutée." };
}

export async function deleteTransactionAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const publicId = String(form.get("publicId") ?? "").trim();

  try {
    await deleteTransaction(publicId);
  } catch (error) {
    return { status: "error", message: toTreasuryErrorMessage(error) };
  }

  revalidatePath("/treasury");
  return { status: "success", message: "Opération supprimée." };
}
