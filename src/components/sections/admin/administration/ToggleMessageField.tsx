import Switch from "@/components/ui/form/switch/Switch";
import Textarea from "@/components/ui/form/textarea/Textarea";
import type { Announcement } from "@/types/site-settings";

interface ToggleMessageFieldProps {
  /** Préfixe des champs envoyés : `<name>Enabled` et `<name>Message`. */
  name: "maintenance" | "announcement";
  label: string;
  description: string;
  value: Announcement;
  maxLength: number;
  error?: string;
}

/** Interrupteur + texte associé (mode maintenance, bandeau d'annonce). */
export default function ToggleMessageField({ name, label, description, value, maxLength, error }: ToggleMessageFieldProps) {
  const messageId = `${name}-message`;
  return (
    <fieldset className="border rounded-3 p-3 h-100">
      <legend className="visually-hidden">{label}</legend>
      <Switch
        id={`${name}-enabled`}
        name={`${name}Enabled`}
        label={label}
        description={description}
        defaultChecked={value.enabled}
      />
      <Textarea
        id={messageId}
        name={`${name}Message`}
        label="Texte affiché"
        defaultValue={value.message}
        maxLength={maxLength}
        rows={3}
        wrapperClass="mt-3"
        className={error ? "is-invalid" : ""}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${messageId}-error` : undefined}
      />
      {error && (
        <div id={`${messageId}-error`} className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </fieldset>
  );
}
