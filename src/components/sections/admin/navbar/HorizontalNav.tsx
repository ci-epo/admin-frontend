import { Fragment } from "react";
import NavMenuItem from "@/components/sections/admin/navbar/NavMenuItem";
import { MENU } from "@/components/sections/admin/navbar/menuItems";

/**
 * Navigation horizontale. Reproduit le partial horizontal.html.
 * Consomme exactement le même MENU que Sidebar — un seul endroit pour
 * gérer la structure de navigation, deux rendus visuels.
 */
export default function HorizontalNav() {
  return (
    <>
      <aside className="pe-app-sidebar horizontal-sidebar" id="horizontal-aside">
        <nav className="pe-app-sidebar-menu nav nav-pills">
          <ul
            className="pe-horizontal-menu mb-0 list-unstyled"
            id="horizontal-menu"
          >
            {MENU.map((section) => (
              <Fragment key={section.title}>
                <li className="pe-menu-title">{section.title}</li>
                {section.items.map((item) => (
                  <NavMenuItem key={item.href ?? item.label} item={item} />
                ))}
              </Fragment>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="sidebar-backdrop" id="sidebar-backdrop"></div>
    </>
  );
}
