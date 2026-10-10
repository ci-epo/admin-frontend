import { parsePasswordForm, parseProfileForm } from "@/lib/schemas/profile.schema";

const formOf = (values: Record<string, string>) => {
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) form.set(key, value);
  return form;
};

describe("parseProfileForm", () => {
  const base = { firstName: " Awa ", name: "Dupont", phoneNumber: "+22670000000", email: "awa@exemple.com" };

  it("nettoie les espaces et renvoie la commande", () => {
    expect(parseProfileForm(formOf(base))).toEqual({ ok: true, data: { ...base, firstName: "Awa" } });
  });

  it("signale chaque champ vide", () => {
    const result = parseProfileForm(formOf({ firstName: "", name: " ", phoneNumber: "", email: "" }));
    expect(result).toMatchObject({
      ok: false,
      fieldErrors: { firstName: expect.any(String), name: expect.any(String), phoneNumber: expect.any(String), email: expect.any(String) },
    });
  });
});

describe("parsePasswordForm", () => {
  const ok = { currentPassword: "bureau2025", newPassword: "Nouveau#2026", confirmPassword: "Nouveau#2026" };

  it("accepte un nouveau mot de passe robuste et confirmé (l'ancien peut être le provisoire, sans symbole)", () => {
    expect(parsePasswordForm(formOf(ok))).toEqual({
      ok: true,
      data: { currentPassword: "bureau2025", newPassword: "Nouveau#2026" },
    });
  });

  it.each(["bureau2026", "short1!", "Password!"])("refuse le nouveau mot de passe faible %s", (newPassword) => {
    const result = parsePasswordForm(formOf({ ...ok, newPassword, confirmPassword: newPassword }));
    expect(result).toMatchObject({ ok: false, fieldErrors: { newPassword: expect.any(String) } });
  });

  it("refuse une confirmation différente", () => {
    expect(parsePasswordForm(formOf({ ...ok, confirmPassword: "Autre#2026" }))).toMatchObject({
      ok: false,
      fieldErrors: { confirmPassword: expect.any(String) },
    });
  });

  it("refuse de réutiliser le mot de passe actuel et exige l'actuel", () => {
    expect(
      parsePasswordForm(formOf({ currentPassword: "Nouveau#2026", newPassword: "Nouveau#2026", confirmPassword: "Nouveau#2026" })),
    ).toMatchObject({ ok: false, fieldErrors: { newPassword: expect.any(String) } });
    expect(parsePasswordForm(formOf({ ...ok, currentPassword: "" }))).toMatchObject({
      ok: false,
      fieldErrors: { currentPassword: expect.any(String) },
    });
  });
});
