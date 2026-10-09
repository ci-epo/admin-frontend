import Link from "next/link";
import type { AdministrationTab } from "@/types/administration";

const TABS: { id: AdministrationTab; label: string; icon: string }[] = [
  { id: "site", label: "Site public", icon: "ri-global-line" },
  { id: "admin", label: "Espace admin", icon: "ri-layout-4-line" },
  { id: "droits", label: "Rôles et permissions", icon: "ri-shield-user-line" },
  { id: "sauvegardes", label: "Sauvegardes", icon: "ri-database-2-line" },
];

interface AdministrationTabsProps {
  active: AdministrationTab;
}

/** Onglets en liens (`?onglet=`) : l'onglet ouvert se partage et suit le bouton retour. */
export default function AdministrationTabs({ active }: AdministrationTabsProps) {
  return (
    // Dans une carte : posés directement sur le bandeau sombre du thème, les onglets inactifs seraient illisibles.
    <nav className="card mb-4 position-relative z-1" aria-label="Rubriques de l'administration">
      <ul className="nav nav-pills gap-2 card-body py-2">
        {TABS.map((tab) => (
          <li key={tab.id} className="nav-item">
            <Link
              href={`/administration?onglet=${tab.id}`}
              className={`nav-link${tab.id === active ? " active" : ""}`}
              aria-current={tab.id === active ? "page" : undefined}
            >
              <i className={`${tab.icon} me-1`} aria-hidden="true"></i>
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
