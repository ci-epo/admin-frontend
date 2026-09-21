import React from "react";

type BadgeVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
type BadgePosition = "inline" | "floating";

interface OutlineBadgeProps {
  label: string;
  badge: { content: React.ReactNode; pill?: boolean; srText?: string };
  variant?: BadgeVariant;
  position?: BadgePosition;
  onClick?: () => void;
  className?: string;
}

export default function OutlineBadge({
  label,
  badge,
  variant = "primary",
  position = "inline",
  onClick,
  className = "",
}: OutlineBadgeProps) {
  const isFloating = position === "floating";
  const { content, pill = false, srText } = badge;

  const badgeClass = [
    "badge",
    pill || isFloating ? "rounded-pill" : "",
    `bg-${variant}`,
    isFloating
      ? "position-absolute top-0 start-100 translate-middle"
      : "ms-1",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={`btn btn-outline-${variant}${isFloating ? " position-relative" : ""} ${className}`.trim()}
      onClick={onClick}
    >
      {label}
      <span className={badgeClass}>
        {content}
        {srText && <span className="visually-hidden">{srText}</span>}
      </span>
    </button>
  );
}