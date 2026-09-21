interface SpinnerProps {
  /** Texte lu par les lecteurs d'écran. */
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export default function Spinner({
  label = "Chargement…",
  size = "md",
  className = "",
}: SpinnerProps) {
  return (
    <div
      className={`spinner-border text-primary${size === "sm" ? " spinner-border-sm" : ""} ${className}`.trim()}
      role="status"
    >
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
