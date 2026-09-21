export interface AboutApp {
  name: string;
  tagline: string;
  version: string;
  releaseDate: string;
}

export interface AboutSysInfo {
  icon: string;
  value: string;
  label: string;
}

export interface AboutModule {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string; // ex: "primary", "success"
  status?: "stable" | "beta";
}

export interface AboutRole {
  role: string;
  badgeClass: string;
  description: string;
  permissions: string[]; // libellés courts
}

export interface AboutTechItem {
  icon: string;
  name: string;
  detail: string;
}

export interface AboutSupportLink {
  icon: string;
  title: string;
  description: string;
  action: string;
  href: string;
}
