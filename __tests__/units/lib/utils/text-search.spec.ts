import { filterBySearch, normalizeSearchText } from "@/lib/utils/text-search";

describe("normalizeSearchText", () => {
  it("retire les accents, la casse et les espaces en bordure", () => {
    expect(normalizeSearchText("  Chargé des Relations Extérieures ")).toBe("charge des relations exterieures");
  });
});

describe("filterBySearch", () => {
  const rows = [
    { name: "SISSAO Moussa Bassana", position: "Chargé des Relations Extérieur", phone: "+22660783979" },
    { name: "OUEDRAOGO Awa", position: "Trésorière Générale", phone: "+22670000000" },
  ];
  const fields = (row: (typeof rows)[number]) => [row.name, row.position, row.phone];

  it("renvoie toute la liste pour une saisie vide ou blanche", () => {
    expect(filterBySearch(rows, "", fields)).toEqual(rows);
    expect(filterBySearch(rows, "   ", fields)).toEqual(rows);
  });

  it("ignore la casse et les accents", () => {
    expect(filterBySearch(rows, "tresoriere", fields)).toEqual([rows[1]]);
    expect(filterBySearch(rows, "EXTÉRIEUR", fields)).toEqual([rows[0]]);
  });

  it("trouve un numéro partiel", () => {
    expect(filterBySearch(rows, "60783979", fields)).toEqual([rows[0]]);
  });

  it("exige que chaque mot apparaisse, dans n'importe quel champ", () => {
    expect(filterBySearch(rows, "sissao relations", fields)).toEqual([rows[0]]);
    expect(filterBySearch(rows, "sissao tresoriere", fields)).toEqual([]);
  });

  it("ne modifie pas la liste d'origine", () => {
    const result = filterBySearch(rows, "", fields);
    expect(result).not.toBe(rows);
  });
});
