import type { InputHTMLAttributes } from "react";

type RadioColor = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
type RadioSize  = "sm" | "md" | "lg";

interface RadioAppearance {
  color?: RadioColor;
  size?: RadioSize;
}

/** `name`, `value`, `checked`, `defaultChecked`, `disabled`… restent les attributs natifs de <input>. */
interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "size" | "color"> {
  id: string;
  label: string;
  appearance?: RadioAppearance;
  onChange?: (value: string) => void;
  wrapperClass?: string;
}

export default function Radio({
  id,
  label,
  value = "",
  appearance = {},
  onChange,
  wrapperClass = "",
  ...rest
}: RadioProps) {
  const { color, size = "md" } = appearance;

  const wrapperCls = [
    "form-check",
    size === "sm" ? "form-check-sm" : size === "lg" ? "form-check-lg" : "",
    color ? `form-check-${color}` : "",
    wrapperClass,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperCls}>
      <input
        className="form-check-input"
        type="radio"
        id={id}
        value={value}
        onChange={() => onChange?.(String(value))}
        {...rest}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
