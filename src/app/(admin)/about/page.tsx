import { notFound } from "next/navigation";
import { isModuleDisabled } from "@/lib/api/administration.endpoints";
import AboutClub from "@/components/sections/admin/about/AboutClub";
import {
  ABOUT_APP,
  ABOUT_MODULES,
  ABOUT_ROLES,
  ABOUT_SUPPORT,
  ABOUT_SYSINFO,
  ABOUT_TECH,
} from "@/components/sections/admin/about/mockData";

export const metadata = {
  title: "À propos | CIE Admin",
  description: "Présentation de la plateforme d'administration CIE Admin : modules, rôles, technologies et support.",
};

export default async function AboutPage() {
  // Module désactivé depuis la page Administration : introuvable, même par son URL.
  if (await isModuleDisabled("about")) notFound();

  return (
    <AboutClub
      app={ABOUT_APP}
      sysInfo={ABOUT_SYSINFO}
      modules={ABOUT_MODULES}
      roles={ABOUT_ROLES}
      tech={ABOUT_TECH}
      support={ABOUT_SUPPORT}
    />
  );
}
