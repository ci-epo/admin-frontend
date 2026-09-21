"use client";

import React, { useRef, useState } from "react";

type InputFileVariant = "native" | "button";
type BtnVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark"
  | "outline-primary" | "outline-secondary" | "outline-success" | "outline-danger"
  | "outline-warning" | "outline-info" | "outline-light" | "outline-dark";
type IconPosition = "left" | "right";

interface InputFileButton {
  variant?: BtnVariant;
  label?: string;
  icon?: string;
  iconPosition?: IconPosition;
}

interface InputFileProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  id?: string;
  label?: string;
  variant?: InputFileVariant;
  /** Options du bouton (variante "button" uniquement). */
  button?: InputFileButton;
  error?: string;
  onFileChange?: (files: FileList | null) => void;
  wrapperClass?: string;
}

export default function InputFile({
  id,
  label,
  variant = "native",
  button = {},
  error,
  onFileChange,
  wrapperClass = "",
  className = "",
  ...rest
}: InputFileProps) {
  const {
    variant: btnVariant = "primary",
    label: btnLabel = "Choose File",
    icon = "ri-upload-2-line",
    iconPosition = "left",
  } = button;
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFileName(files?.[0]?.name ?? "");
    onFileChange?.(files);
  };

  if (variant === "native") {
    return (
      <div className={wrapperClass}>
        {label && <label htmlFor={id} className="form-label">{label}</label>}
        <input
          id={id}
          type="file"
          className={`form-control ${className}`.trim()}
          onChange={handleChange}
          {...rest}
        />
        {error && <small className="text-danger mt-2 d-block">{error}</small>}
      </div>
    );
  }

  // Variant "button"
  const iconEl = icon && <i className={`${icon}${iconPosition === "left" ? " me-2" : " ms-2"}`} aria-hidden="true" />;

  return (
    <div className={`file-upload ${wrapperClass}`.trim()}>
      <button
        type="button"
        className={`btn btn-${btnVariant}`}
        onClick={() => inputRef.current?.click()}
      >
        {iconPosition === "left" && iconEl}
        {btnLabel}
        {fileName && <span className="ms-2 fw-normal opacity-75">({fileName})</span>}
        {iconPosition === "right" && iconEl}
      </button>
      <input
        ref={inputRef}
        type="file"
        className={`file-upload-item ${className}`.trim()}
        onChange={handleChange}
        {...rest}
      />
      {error && <small className="file-error text-danger mt-2 d-block">{error}</small>}
    </div>
  );
}