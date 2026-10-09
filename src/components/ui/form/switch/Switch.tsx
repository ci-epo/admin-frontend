interface SwitchProps {
  id: string;
  /** Nom du champ envoyé avec le formulaire (valeur `on` quand l'interrupteur est activé). */
  name: string;
  label: string;
  defaultChecked?: boolean;
  /** Valeur envoyée à la place de `on` (listes de cases : `name` répété). */
  value?: string;
  description?: string;
  disabled?: boolean;
}

/** Interrupteur non contrôlé, qui participe à l'envoi d'un formulaire (contrairement à `Checkbox`). */
export default function Switch({ id, name, label, defaultChecked, value, description, disabled }: SwitchProps) {
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={id}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-describedby={description ? `${id}-description` : undefined}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
      {description && (
        <div id={`${id}-description`} className="form-text mt-0">
          {description}
        </div>
      )}
    </div>
  );
}
