"use client";

import { useState } from "react";
import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import Input from "@/components/ui/form/input/Input";
import Textarea from "@/components/ui/form/textarea/Textarea";
import Modal from "@/components/ui/modal/Modal";
import { useActionForm } from "@/hooks/use-action-form";
import { ROAD_LABELS } from "@/lib/utils/road-labels";
import type { ActionState } from "@/types/administration";
import type { Road, TreasuryFormOptions, TreasuryTransactionType } from "@/types/treasury";

interface AddTransactionModalProps {
  action: (state: ActionState, form: FormData) => Promise<ActionState>;
  options: TreasuryFormOptions;
  isOpen: boolean;
  onClose: () => void;
}

const ROADS = Object.keys(ROAD_LABELS) as Road[];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function AddTransactionModal({ action, options, isOpen, onClose }: AddTransactionModalProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const [type, setType] = useState<TreasuryTransactionType>("Entrée");
  const isDone = state.status === "success";
  const fieldError = (name: string) => (state.status === "error" ? state.fieldErrors?.[name] : undefined);
  const categoryOptions = type === "Entrée" ? options.categoriesIn : options.categoriesOut;

  return (
    <Modal title="Nouvelle opération" isOpen={isOpen} onClose={onClose} dialog={{ centered: true, size: "lg" }}>
      <form onSubmit={handleSubmit} className="text-start">
        <FormFeedback state={state} />
        {!isDone && (
          <>
            <div className="row">
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="trx-add-account" className="form-label">
                    Caisse
                  </label>
                  <select
                    id="trx-add-account"
                    name="accountId"
                    className={`form-select${fieldError("accountId") ? " is-invalid" : ""}`}
                    required
                  >
                    {options.accounts.map((account) => (
                      <option key={account.publicId} value={account.publicId}>
                        {account.label}
                      </option>
                    ))}
                  </select>
                  {fieldError("accountId") && <div className="invalid-feedback d-block">{fieldError("accountId")}</div>}
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="trx-add-type" className="form-label">
                    Type
                  </label>
                  <select
                    id="trx-add-type"
                    className="form-select"
                    value={type}
                    onChange={(event) => setType(event.target.value as TreasuryTransactionType)}
                  >
                    <option value="Entrée">Entrée</option>
                    <option value="Dépense">Dépense</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="trx-add-category" className="form-label">
                    Catégorie
                  </label>
                  <select
                    id="trx-add-category"
                    name="categoryId"
                    className={`form-select${fieldError("categoryId") ? " is-invalid" : ""}`}
                    required
                  >
                    {categoryOptions.map((category) => (
                      <option key={category.publicId} value={category.publicId}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {fieldError("categoryId") && <div className="invalid-feedback d-block">{fieldError("categoryId")}</div>}
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="trx-add-road" className="form-label">
                    Moyen de paiement
                  </label>
                  <select
                    id="trx-add-road"
                    name="road"
                    className={`form-select${fieldError("road") ? " is-invalid" : ""}`}
                    required
                  >
                    {ROADS.map((road) => (
                      <option key={road} value={road}>
                        {ROAD_LABELS[road]}
                      </option>
                    ))}
                  </select>
                  {fieldError("road") && <div className="invalid-feedback d-block">{fieldError("road")}</div>}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Input
                  id="trx-add-operator-name"
                  name="operatorName"
                  label="Nom"
                  error={fieldError("operatorName")}
                  wrapperClass="mb-3"
                  required
                />
              </div>
              <div className="col-6">
                <Input
                  id="trx-add-operator-phone"
                  name="operatorPhone"
                  label="Téléphone"
                  placeholder="+225..."
                  error={fieldError("operatorPhone")}
                  wrapperClass="mb-3"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Input
                  id="trx-add-amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="1"
                  label="Montant (FCFA)"
                  error={fieldError("amount")}
                  wrapperClass="mb-3"
                  required
                />
              </div>
              <div className="col-6">
                <Input
                  id="trx-add-date"
                  name="date"
                  type="date"
                  label="Date"
                  defaultValue={today()}
                  error={fieldError("date")}
                  wrapperClass="mb-3"
                  required
                />
              </div>
            </div>

            <Textarea
              id="trx-add-objectif"
              name="objectif"
              label="Objectif"
              wrapperClass="mb-3"
              required
            />
            {fieldError("objectif") && <div className="text-danger small mb-3">{fieldError("objectif")}</div>}
          </>
        )}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={isPending}>
            {isDone ? "Fermer" : "Annuler"}
          </button>
          {!isDone && <SubmitButton label="Ajouter" pendingLabel="Ajout…" icon="ri-add-line" isPending={isPending} />}
        </div>
      </form>
    </Modal>
  );
}
