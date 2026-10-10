import Alert from "@/components/ui/alert/Alert";

/** Compte créé par le bureau : mot de passe provisoire à remplacer avant d'utiliser le reste de l'espace d'administration. */
export default function ForcePasswordNotice() {
  return (
    <Alert
      variant="warning"
      icon="ri-lock-password-line"
      message="Vous utilisez un mot de passe provisoire. Choisissez votre mot de passe personnel ci-dessous pour accéder au reste de l'espace d'administration."
      className="mb-4"
    />
  );
}
