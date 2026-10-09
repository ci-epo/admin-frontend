"use client";

import { useState } from "react";
import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SubmitButton from "@/components/sections/admin/administration/SubmitButton";
import { useActionForm } from "@/hooks/use-action-form";
import type { FormAction } from "@/types/administration";
import type { PermissionMatrix, PermissionTarget } from "@/types/permission-matrix";

interface PermissionMatrixFormProps {
  matrix: PermissionMatrix;
  /** Sans `manage:access`, la matrice se lit mais ne s'enregistre pas (l'API refuserait). */
  canEdit: boolean;
  action: FormAction;
}

const keyOf = (target: PermissionTarget) => `${target.scope}:${target.publicId}`;

/** Choix d'un rôle ou d'un poste, puis des permissions cochées pour cette cible. */
export default function PermissionMatrixForm({ matrix, canEdit, action }: PermissionMatrixFormProps) {
  const targets = [...matrix.roles, ...matrix.positions];
  const { state, isPending, handleSubmit } = useActionForm(action);
  const [targetKey, setTargetKey] = useState(() => (targets[0] ? keyOf(targets[0]) : ""));
  const target = targets.find((item) => keyOf(item) === targetKey);
  const [checked, setChecked] = useState<string[]>(() => target?.permissionIds ?? []);

  const selectTarget = (key: string) => {
    const next = targets.find((item) => keyOf(item) === key);
    setTargetKey(key);
    setChecked(next?.permissionIds ?? []);
  };

  const toggle = (permissionId: string) => {
    setChecked((current) =>
      current.includes(permissionId) ? current.filter((id) => id !== permissionId) : [...current, permissionId],
    );
  };

  if (!target) {
    return <p className="text-muted">Aucun rôle ni poste à configurer.</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card position-relative z-1">
      <div className="card-body p-4">
        <FormFeedback state={state} />
        <div className="mb-3">
          <label htmlFor="permission-target" className="form-label">
            Rôle ou poste
          </label>
          <select
            id="permission-target"
            name="target"
            className="form-select"
            value={targetKey}
            onChange={(event) => selectTarget(event.target.value)}
          >
            <optgroup label="Rôles">
              {matrix.roles.map((role) => (
                <option key={keyOf(role)} value={keyOf(role)}>
                  {role.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Postes du bureau">
              {matrix.positions.map((position) => (
                <option key={keyOf(position)} value={keyOf(position)}>
                  {position.label}
                </option>
              ))}
            </optgroup>
          </select>
          <div className="form-text">
            {target.scope === "role"
              ? "Permissions de base de ce rôle."
              : "Permissions ajoutées, pour les membres qui occupent ce poste, à celles du rôle bureau."}
          </div>
        </div>

        <fieldset disabled={!canEdit || isPending}>
          <legend className="fs-6 mb-2">Permissions</legend>
          {matrix.permissions.map((permission) => (
            <div key={permission.publicId} className="form-check mb-2">
              <input
                id={`permission-${permission.publicId}`}
                type="checkbox"
                name="permission"
                value={permission.publicId}
                className="form-check-input"
                checked={checked.includes(permission.publicId)}
                onChange={() => toggle(permission.publicId)}
              />
              <label className="form-check-label" htmlFor={`permission-${permission.publicId}`}>
                <span className="fw-semibold">{permission.name}</span>
                <span className="d-block text-muted small">{permission.description}</span>
              </label>
            </div>
          ))}
        </fieldset>

        {!canEdit && (
          <p className="text-muted small mt-3 mb-0">
            Lecture seule : la permission <code>manage:access</code> est nécessaire pour modifier les droits.
          </p>
        )}
      </div>
      {canEdit && (
        <div className="card-footer d-flex justify-content-end">
          <SubmitButton label="Enregistrer" pendingLabel="Enregistrement…" isPending={isPending} />
        </div>
      )}
    </form>
  );
}
