import { canUseAdminFrontend } from "@/lib/auth/access-role";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HorizontalNav, MENU, Sidebar } from "@/components/sections/admin/navbar";
import { Header, NOTIFICATIONS, CART_ITEMS } from "@/components/sections/admin/header";
import Footer from "@/components/sections/admin/Footer";
import AdminAnnouncement from "@/components/sections/admin/administration/AdminAnnouncement";
import ScrollToTop from "@/components/ui/scroll_to_top/ScrollToTop";
import { getAdminSettingsOrDefault } from "@/lib/api/administration.endpoints";
import { getCurrentAccess } from "@/lib/auth/current-access";
import { logoutAction } from "@/app/(admin)/logout.actions";
import { withoutHiddenModules, withoutUnauthorizedModules } from "@/lib/utils/admin-modules";

/**
 * Rendu à chaque requête : le menu et le bandeau dépendent des réglages enregistrés (Administration › Espace admin),
 * et du rôle/des permissions de l'utilisateur connecté. Explicite, pour que `next build` ne tente pas un pré-rendu
 * statique qui interrogerait l'API.
 */
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // admin-frontend est réservé au bureau et à l'administrateur (décision 0015 d'app-service) : membre/invité n'y ont aucun accès.
  const access = await getCurrentAccess();
  if (!access || !canUseAdminFrontend(access.role)) {
    redirect("/login");
  }

  // Mot de passe provisoire (compte créé par le bureau) : rien d'autre que « Voir profil » tant qu'il n'est pas changé.
  if (access.mustChangePassword && (await headers()).get("x-pathname") !== "/profile") {
    redirect("/profile");
  }

  // Lu à chaque requête (pas de cache) : un module désactivé ou un bandeau disparaît dès l'enregistrement.
  const settings = await getAdminSettingsOrDefault();
  const sections = withoutUnauthorizedModules(withoutHiddenModules(MENU, settings.hiddenModules), access.permissions);
  const user = {
    name: [access.firstName, access.name].filter(Boolean).join(" ") || access.email || "Bureau",
    email: access.email ?? "",
    avatarUrl: "/assets/images/avatar/avatar-3.jpg",
  };

  return (
    <div id="layout-wrapper">
      <Header
        user={user}
        notifications={NOTIFICATIONS}
        unreadCount={4}
        cartItems={CART_ITEMS}
        onLogout={logoutAction}
      />

      <Sidebar sections={sections} />

      <HorizontalNav sections={sections} />

      <main className="app-wrapper">
        <div className="container-fluid">
          {settings.announcement.enabled && <AdminAnnouncement message={settings.announcement.message} />}
          {children}
        </div>
      </main>

      <Footer />

      <ScrollToTop />
    </div>
  );
}
