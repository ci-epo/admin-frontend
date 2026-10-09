import { moduleKeyOf, toggleableModules, withoutHiddenModules, withoutUnauthorizedModules } from "@/lib/utils/admin-modules";

const MENU = [
  {
    title: "Main",
    items: [
      { label: "Tableau de bord", href: "/dashboard" },
      { label: "Membres", href: "/member" },
      { label: "Trésorerie", href: "/treasury" },
    ],
  },
  { title: "Système", items: [{ label: "Administration", href: "/administration" }] },
  { title: "Finances", items: [{ label: "Budgets", href: "/treasury/budgets" }] },
];

const MENU_WITH_PERMISSIONS = [
  {
    title: "Main",
    items: [
      { label: "Tableau de bord", href: "/dashboard" },
      { label: "Trésorerie", href: "/treasury", permission: "page:treasury" },
    ],
  },
  {
    title: "Système",
    items: [{ label: "Administration", href: "/administration", permission: "page:administration" }],
  },
];

describe("moduleKeyOf", () => {
  it("retourne le premier segment de l'URL", () => {
    expect(moduleKeyOf("/treasury/budgets")).toBe("treasury");
  });
});

describe("toggleableModules", () => {
  it("exclut le tableau de bord et l'administration", () => {
    expect(toggleableModules(MENU).map((module) => module.key)).toEqual(["member", "treasury", "treasury"]);
  });
});

describe("withoutHiddenModules", () => {
  it("retire les modules désactivés et les sections devenues vides", () => {
    const sections = withoutHiddenModules(MENU, ["treasury", "administration", "dashboard"]);

    expect(sections.map((section) => section.title)).toEqual(["Main", "Système"]);
    expect(sections[0].items.map((item) => item.href)).toEqual(["/dashboard", "/member"]);
  });
});

describe("withoutUnauthorizedModules", () => {
  it("garde les entrées sans permission requise, retire celles qui manquent", () => {
    const sections = withoutUnauthorizedModules(MENU_WITH_PERMISSIONS, []);

    expect(sections).toHaveLength(1);
    expect(sections[0].items.map((item) => item.href)).toEqual(["/dashboard"]);
  });

  it("garde une entrée dont la permission est accordée", () => {
    const sections = withoutUnauthorizedModules(MENU_WITH_PERMISSIONS, ["page:treasury"]);

    expect(sections[0].items.map((item) => item.href)).toEqual(["/dashboard", "/treasury"]);
    expect(sections).toHaveLength(1);
  });

  it("avec toutes les permissions, ne retire rien", () => {
    const sections = withoutUnauthorizedModules(MENU_WITH_PERMISSIONS, ["page:treasury", "page:administration"]);

    expect(sections.map((section) => section.title)).toEqual(["Main", "Système"]);
  });
});
