import { parseCreateMemberForm, parseUpdateMemberForm } from "@/lib/schemas/member.schema";

const base = { name: "Dupont", firstName: "Awa", phoneNumber: "+22670000000", email: "awa@exemple.com", type: "MEMBER" };
const formOf = (values: Record<string, string>) => {
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) form.set(key, value);
  return form;
};

describe("parseCreateMemberForm", () => {
  it("sans mot de passe, crée une fiche sans compte (pas de champ password)", () => {
    const result = parseCreateMemberForm(formOf(base));
    expect(result).toEqual({ ok: true, data: base });
  });

  it("avec un mot de passe conforme, l'ajoute à la commande", () => {
    const result = parseCreateMemberForm(formOf({ ...base, password: "Passw0rd!" }));
    expect(result).toEqual({ ok: true, data: { ...base, password: "Passw0rd!" } });
  });

  it.each(["short1!", "Password!", "Passw0rd1"])("refuse le mot de passe %s (règle de l'API)", (password) => {
    const result = parseCreateMemberForm(formOf({ ...base, password }));
    expect(result).toMatchObject({ ok: false, fieldErrors: { password: expect.stringContaining("Mot de passe") } });
  });
});

describe("parseUpdateMemberForm", () => {
  it("n'envoie jamais de mot de passe à la modification", () => {
    const result = parseUpdateMemberForm(formOf({ ...base, password: "Passw0rd!" }));
    expect(result).toEqual({ ok: true, data: base });
  });
});
