import AuthHeader from "@/components/sections/auth/AuthHeader";
import EmptyState from "@/components/ui/empty-state/EmptyState";

export const metadata = {
  title: "Connexion | CIE Admin",
  description: "Connexion à l'administration du club",
};

export default function LoginPage() {
  return (
    <>
      <AuthHeader />
      <div className="container position-relative z-1 py-10">
        <EmptyState
          icon="ri-lock-line"
          title="Connexion"
          description="L'authentification sera disponible prochainement."
        />
      </div>
    </>
  );
}
