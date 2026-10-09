import Spinner from "@/components/ui/spinner/Spinner";

interface SubmitButtonProps {
  label: string;
  pendingLabel: string;
  isPending: boolean;
  icon?: string;
  variant?: "primary" | "warning" | "danger";
  disabled?: boolean;
}

export default function SubmitButton({
  label,
  pendingLabel,
  isPending,
  icon = "ri-save-3-line",
  variant = "primary",
  disabled = false,
}: SubmitButtonProps) {
  return (
    <button type="submit" className={`btn btn-${variant}`} disabled={isPending || disabled} aria-busy={isPending}>
      {isPending ? (
        <Spinner size="sm" label={pendingLabel} className="me-2 text-white" />
      ) : (
        <i className={`${icon} me-1`} aria-hidden="true"></i>
      )}
      {isPending ? pendingLabel : label}
    </button>
  );
}
