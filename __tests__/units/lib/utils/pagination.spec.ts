import { paginate } from "@/lib/utils/pagination";

describe("paginate", () => {
  const items = Array.from({ length: 10 }, (_, i) => i + 1);

  it("retourne la première page avec ses bornes", () => {
    expect(paginate(items, 1, 4)).toEqual({
      items: [1, 2, 3, 4],
      page: 1,
      totalPages: 3,
      from: 1,
      to: 4,
      total: 10,
    });
  });

  it("borne la dernière page au nombre d'éléments restants", () => {
    expect(paginate(items, 3, 4)).toMatchObject({ items: [9, 10], from: 9, to: 10 });
  });

  it("ramène une page hors limites dans l'intervalle valide", () => {
    expect(paginate(items, 99, 4).page).toBe(3);
    expect(paginate(items, 0, 4).page).toBe(1);
  });

  it("retourne une seule page vide pour une liste vide", () => {
    expect(paginate([], 1, 4)).toEqual({
      items: [],
      page: 1,
      totalPages: 1,
      from: 0,
      to: 0,
      total: 0,
    });
  });
});
