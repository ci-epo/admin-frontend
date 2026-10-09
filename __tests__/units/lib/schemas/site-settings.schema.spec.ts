import {
  parseAdminSettingsForm,
  parseWebSettingsDto,
  parseWebSettingsForm,
} from "@/lib/schemas/site-settings.schema";

const webForm = (overrides: Record<string, string> = {}) => {
  const form = new FormData();
  const values: Record<string, string> = {
    siteName: " Club Informatique de l'EPO ",
    siteDescription: "Club étudiant",
    contactEmail: "contact@cie-epo.bf",
    facebookUrl: "https://facebook.com/cie",
    linkedinUrl: "",
    githubUrl: "https://github.com/cie",
    maintenanceMessage: "",
    announcementMessage: "",
    ...overrides,
  };
  Object.entries(values).forEach(([key, value]) => form.set(key, value));
  return form;
};

describe("parseWebSettingsForm", () => {
  it("retourne les valeurs nettoyées et lit les interrupteurs", () => {
    const form = webForm();
    form.set("maintenanceEnabled", "on");

    const result = parseWebSettingsForm(form);

    expect(result).toEqual({
      ok: true,
      data: expect.objectContaining({
        siteName: "Club Informatique de l'EPO",
        linkedinUrl: "",
        maintenanceEnabled: true,
        announcementEnabled: false,
      }),
    });
  });

  it("signale chaque champ invalide", () => {
    const form = webForm({ siteName: "", contactEmail: "contact@", githubUrl: "javascript:alert(1)" });
    form.set("announcementEnabled", "on");

    const result = parseWebSettingsForm(form);

    expect(result).toEqual({
      ok: false,
      fieldErrors: {
        siteName: expect.any(String),
        contactEmail: expect.any(String),
        githubUrl: expect.any(String),
        announcementMessage: expect.any(String),
      },
    });
  });

  it("rejette un texte plus long que la limite de l'API", () => {
    const result = parseWebSettingsForm(webForm({ siteDescription: "x".repeat(301) }));

    expect(result).toEqual({ ok: false, fieldErrors: { siteDescription: "300 caractères au maximum." } });
  });
});

describe("parseAdminSettingsForm", () => {
  it("déduit les modules désactivés des cases décochées", () => {
    const form = new FormData();
    form.append("activeModules", "member");
    form.set("announcementMessage", "");
    const modules = [
      { key: "member", label: "Membres" },
      { key: "treasury", label: "Trésorerie" },
    ];

    expect(parseAdminSettingsForm(form, modules)).toEqual({
      ok: true,
      data: { announcementEnabled: false, announcementMessage: "", hiddenModules: ["treasury"] },
    });
  });
});

describe("parseWebSettingsDto", () => {
  it("rejette une réponse qui ne respecte pas le contrat", () => {
    expect(() => parseWebSettingsDto({ siteName: "CIE" })).toThrow(
      expect.objectContaining({ code: "SERVER_ERROR" }),
    );
  });
});
