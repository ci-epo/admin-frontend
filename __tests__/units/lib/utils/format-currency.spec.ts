import { formatMontant, formatSolde } from "@/lib/utils/format-currency";

// toLocaleString("fr-FR") sépare les milliers par une espace insécable (U+202F ou U+00A0).
const normalize = (value: string) => value.replace(/\s/g, " ");

describe("formatMontant", () => {
  it("préfixe un montant positif par +", () => {
    expect(normalize(formatMontant(15000))).toBe("+15 000 FCFA");
  });

  it("préfixe un montant négatif par -", () => {
    expect(normalize(formatMontant(-36000))).toBe("-36 000 FCFA");
  });
});

describe("formatSolde", () => {
  it("formate un solde sans signe explicite", () => {
    expect(normalize(formatSolde(255000))).toBe("255 000 FCFA");
  });
});
