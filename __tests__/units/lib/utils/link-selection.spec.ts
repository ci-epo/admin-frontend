import { computeLinkChanges } from "@/lib/utils/link-selection";

const links = [
  { linkId: "L1", targetId: "P1" },
  { linkId: "L2", targetId: "P2" },
];

describe("computeLinkChanges", () => {
  it("ne change rien quand la sélection correspond aux liaisons", () => {
    expect(computeLinkChanges(links, ["P1", "P2"])).toEqual({ toCreate: [], toDelete: [] });
  });

  it("crée les permissions cochées non liées", () => {
    expect(computeLinkChanges(links, ["P1", "P2", "P3"])).toEqual({ toCreate: ["P3"], toDelete: [] });
  });

  it("supprime les liaisons décochées, par id de liaison", () => {
    expect(computeLinkChanges(links, ["P2"])).toEqual({ toCreate: [], toDelete: ["L1"] });
  });

  it("gère une sélection vide et un premier ajout", () => {
    expect(computeLinkChanges([], ["P9"])).toEqual({ toCreate: ["P9"], toDelete: [] });
    expect(computeLinkChanges(links, [])).toEqual({ toCreate: [], toDelete: ["L1", "L2"] });
  });
});
