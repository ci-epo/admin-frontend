"use client";

import React, { useEffect, useId } from "react";

interface ModalAction {
  label: string;
  variant?: string;       // ex: "btn-primary", "btn-secondary"
  onClick?: () => void;
  dismiss?: boolean;      // ferme le modal au clic
}

interface ModalDialogOptions {
  size?: "sm" | "md" | "lg" | "xl";
  centered?: boolean;
  scrollable?: boolean;
}

interface ModalProps {
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: ModalAction[];
  dialog?: ModalDialogOptions;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({
  title,
  children,
  footer,
  dialog = {},
  isOpen,
  onClose,
}: ModalProps) {
  const id = useId();
  const { size = "md", centered = false, scrollable = false } = dialog;

  // Fermeture sur Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Bloquer le scroll du body
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const dialogClass = [
    "modal-dialog",
    size !== "md" ? `modal-${size}` : "",
    centered ? "modal-dialog-centered" : "",
    scrollable ? "modal-dialog-scrollable" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        id={id}
        tabIndex={-1}
        role="dialog"
        aria-labelledby={`${id}-label`}
        aria-modal="true"
      >
        <div className={dialogClass} role="document">
          <div className="modal-content">

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title" id={`${id}-label`}>
                {title}
              </h5>
              <button
                type="button"
                className="btn-close icon-btn-sm"
                aria-label="Close"
                onClick={onClose}
              >
                <i className="ri-close-large-line fw-semibold" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">{children}</div>

            {/* Footer */}
            {footer && footer.length > 0 && (
              <div className="modal-footer">
                {footer.map((action, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`btn ${action.variant ?? "btn-secondary"}`}
                    onClick={() => {
                      action.onClick?.();
                      if (action.dismiss) onClose();
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}