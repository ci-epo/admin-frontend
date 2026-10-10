import type { UserAccess } from "@/types/auth";

const ROLE_LABELS: Record<string, string> = { admin: "Administrateur", bureau: "Bureau", membre: "Membre" };

export default function ProfileHeader({ access }: { access: UserAccess }) {
  const fullName = [access.firstName, access.name].filter(Boolean).join(" ") || access.email || "Mon profil";
  const roleLabel = ROLE_LABELS[access.role] ?? access.role;
  const positions = access.positions.map((position) => position.name).join(", ");

  return (
    <div className="card archive-hero mb-4 position-relative z-1">
      <div className="card-body p-4 d-flex align-items-start gap-3">
        <span className="archive-hero-icon" aria-hidden>
          <i className="ri-user-3-line"></i>
        </span>
        <div>
          <h1 className="h4 archive-hero-title mb-1">{fullName}</h1>
          <p className="archive-hero-subtitle mb-0">
            {roleLabel}
            {positions && ` · ${positions}`}
          </p>
        </div>
      </div>
    </div>
  );
}
