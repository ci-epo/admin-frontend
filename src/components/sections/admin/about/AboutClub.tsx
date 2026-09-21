import AboutIntro from "@/components/sections/admin/about/AboutIntro";
import AboutModules from "@/components/sections/admin/about/AboutModules";
import AboutRoles from "@/components/sections/admin/about/AboutRoles";
import AboutSupport from "@/components/sections/admin/about/AboutSupport";
import AboutSysInfoRow from "@/components/sections/admin/about/AboutSysInfoRow";
import AboutTech from "@/components/sections/admin/about/AboutTech";
import type {
  AboutApp,
  AboutModule,
  AboutRole,
  AboutSupportLink,
  AboutSysInfo,
  AboutTechItem,
} from "@/components/sections/admin/about/types";

interface AboutClubProps {
  app: AboutApp;
  sysInfo: AboutSysInfo[];
  modules: AboutModule[];
  roles: AboutRole[];
  tech: AboutTechItem[];
  support: AboutSupportLink[];
}

export default function AboutClub({ app, sysInfo, modules, roles, tech, support }: AboutClubProps) {
  return (
    <div className="position-relative z-1">
      <AboutSysInfoRow items={sysInfo} />
      <AboutIntro app={app} />
      <AboutModules modules={modules} />
      <AboutRoles roles={roles} />
      <AboutTech items={tech} />
      <AboutSupport links={support} />

      <div className="card mb-0">
        <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 text-muted small">
          <span>
            <i className="ri-copyright-line me-1"></i>
            {new Date().getFullYear()} {app.name} — Club Informatique &amp; Électronique. Tous droits réservés.
          </span>
          <span>Distribué sous licence MIT · Version {app.version}</span>
        </div>
      </div>
    </div>
  );
}
