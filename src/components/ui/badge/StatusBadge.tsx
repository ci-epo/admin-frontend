type StatusTone = "success" | "danger" | "secondary" | "warning" | "primary" | "info";

interface StatusBadgeProps {
  label: string;
  tone: StatusTone;
  className?: string;
}

export default function StatusBadge({ label, tone, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`badge py-1 rounded-3 border fw-medium bg-${tone}-subtle text-${tone} border-${tone} ${className}`.trim()}
    >
      {label}
    </span>
  );
}
