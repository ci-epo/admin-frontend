import Image from "next/image";
import Link from "next/link";
import type { UserProfile } from "@/components/sections/admin/header/types";

interface ProfileMenuProps {
  user: UserProfile;
  onLogout?: () => Promise<void>;
}

export default function ProfileMenu({ user, onLogout }: ProfileMenuProps) {
  return (
    <div className="dropdown pe-dropdown-mega d-none d-md-block">
      <button
        className="header-profile-btn btn gap-1 text-start"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <div className="d-none d-xl-block pe-2">
          <span className="d-block mb-0 fs-12 fw-semibold">{user.name}</span>
          <span className="d-block mb-0 fs-10 text-muted">{user.email}</span>
        </div>
        <span className="header-btn btn position-relative">
          <Image
            src={user.avatarUrl}
            width={36}
            height={36}
            alt="Avatar"
            className="img-fluid rounded-circle"
          />
        </span>
      </button>

      <div className="dropdown-menu dropdown-mega-sm header-dropdown-menu p-3">
        <div className="border-bottom pb-2 mb-2 d-flex align-items-center gap-2">
          <Image src={user.avatarUrl} width={36} height={36} alt="Avatar" className="avatar-md" />
          <div>
            <Link href="/profile">
              <h6 className="mb-0 lh-base">{user.name}</h6>
            </Link>
            <p className="mb-0 fs-13 text-muted">{user.email}</p>
          </div>
        </div>

        <ul className="list-unstyled mb-1 border-bottom pb-1">
          <li>
            <Link className="dropdown-item" href="/profile">
              <i className="bi bi-person me-2"></i> Voir profil
            </Link>
          </li>
        </ul>

        <ul className="list-unstyled mb-0">
          <li>
            {onLogout ? (
              <form action={onLogout}>
                <button type="submit" className="dropdown-item">
                  <i className="bi bi-box-arrow-right me-2"></i> Se déconnecter
                </button>
              </form>
            ) : (
              <Link className="dropdown-item" href="/login">
                <i className="bi bi-box-arrow-right me-2"></i> Se déconnecter
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}