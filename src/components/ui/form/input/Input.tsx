import React from "react";

type InputSize   = "sm" | "md" | "lg";
type InputRound  = "0" | "1" | "2" | "3" | "4" | "5" | "pill";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  id: string;
  label?: string;
  size?: InputSize;
  rounded?: InputRound;
  error?: string;          // message d'erreur → état is-invalid
  wrapperClass?: string;   // classe sur le div wrapper (si label ou erreur)
}

export default function Input({
  id,
  label,
  required = false,
  size = "md",
  rounded,
  error,
  wrapperClass = "",
  className = "",
  type = "text",
  ...rest
}: InputProps) {
  const isInvalid = !!error;

  const inputClass = [
    "form-control",
    size === "sm" ? "form-control-sm" : size === "lg" ? "form-control-lg" : "",
    rounded !== undefined ? `rounded-${rounded}` : "",
    isInvalid ? "is-invalid" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const input = (
    <>
      <input
        id={id}
        type={type}
        className={inputClass}
        required={required}
        aria-describedby={isInvalid ? `${id}-error` : undefined}
        aria-invalid={isInvalid || undefined}
        {...rest}
      />
      {isInvalid && (
        <div id={`${id}-error`} className="invalid-feedback">
          {error}
        </div>
      )}
    </>
  );

  if (!label) return <>{input}</>;

  return (
    <div className={wrapperClass}>
      <label
        htmlFor={id}
        className={`form-label${isInvalid ? " is-invalid" : ""}`}
      >
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      {input}
    </div>
  );
}