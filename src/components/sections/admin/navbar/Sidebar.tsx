import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import NavMenuItem from "@/components/sections/admin/navbar/NavMenuItem";
import type { NavSection } from "@/components/sections/admin/navbar/menuItems";

/**
 * Sidebar verticale (par défaut). Reproduit le partial sidebar.html.
 * Consomme MENU depuis menuItems.ts (source unique partagée avec HorizontalNav).
 */
interface SidebarProps {
  /** Menu à afficher : MENU (menuItems.ts) sans les modules désactivés. */
  sections: NavSection[];
}

export default function Sidebar({ sections }: SidebarProps) {
  return (
    <aside className="pe-app-sidebar" id="sidebar">
      <div className="pe-app-sidebar-logo px-6 d-flex align-items-center position-relative">
        <Link href="/" className="d-flex align-items-end logo-main">
          <Image
            height={40}
            width={40}
            className="logo-dark"
            alt="Logo Club Informatique de l'EPO (CIE)"
            src="/assets/images/logo-md.png"
          />
          <Image
            height={40}
            width={40}
            className="logo-light"
            alt="Logo Club Informatique de l'EPO (CIE)"
            src="/assets/images/logo-md-light.png"
          />
          <h3 className="text-body-emphasis fw-bolder mb-0 ms-1">CIE</h3>
        </Link>
        <button
          type="button"
          id="sidebarDefaultArrow"
          className="btn btn-sm p-0 fs-16 text-body-emphasis ms-auto float-end d-none icon-hover-btn"
          aria-label="Collapse sidebar"
        >
          <i className="ri-arrow-right-line fs-5"></i>
        </button>
      </div>

      <nav
        className="pe-app-sidebar-menu nav nav-pills"
        data-simplebar
        id="sidebar-simplebar"
      >
        <div className="d-flex align-items-start flex-column w-100">
          <ul className="pe-main-menu list-unstyled">
            {sections.map((section) => (
              <Fragment key={section.title}>
                <li className="pe-menu-title">{section.title}</li>
                {section.items.map((item) => (
                  <NavMenuItem key={item.href ?? item.label} item={item} />
                ))}
              </Fragment>
            ))}
          </ul>

          {/* Widget en bas du sidebar */}
          <div className="sidebar-widget text-center">
            <Image
              src="/assets/images/sidebar-widget.png"
              width={113}
              height={111}
              alt="Widget"
            />
            <p className="text-muted fw-semibold">
              Click here to update the new version
            </p>
            <button type="button" className="btn btn-primary rounded-pill w-100">
              Update Now
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
