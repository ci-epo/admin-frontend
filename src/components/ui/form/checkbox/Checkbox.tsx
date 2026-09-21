"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";

type CheckColor = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
type CheckSize  = "sm" | "md" | "lg";
type CheckVariant = "checkbox" | "switch";

interface CheckboxAppearance {
  color?: CheckColor;
  size?: CheckSize;
  variant?: CheckVariant;
}

interface CheckboxProps {
  id: string;
  label: string;
  defaultChecked?: boolean;
  appearance?: CheckboxAppearance;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  wrapperClass?: string;
}

export default function Checkbox({
  id,
  label,
  defaultChecked = false,
  appearance = {},
  disabled = false,
  onChange,
  wrapperClass = "",
}: CheckboxProps) {
  const { color, size = "md", variant = "checkbox" } = appearance;
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    onChange?.(e.target.checked);
  };

  const isSwitch = variant === "switch";

  const wrapperCls = [
    "form-check",
    size === "sm" ? "form-check-sm" : size === "lg" ? "form-check-lg" : "",
    isSwitch ? "form-switch" : "",
    isSwitch && color ? `form-switch-${color}` : "",
    !isSwitch && color ? `form-check-${color}` : "",
    wrapperClass,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperCls}>
      <input
        className="form-check-input"
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        role={isSwitch ? "switch" : undefined}
        onChange={handleChange}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
