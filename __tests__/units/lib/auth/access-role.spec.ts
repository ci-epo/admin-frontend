import { canUseAdminFrontend } from "@/lib/auth/access-role";

describe("canUseAdminFrontend", () => {
  it.each(["bureau", "admin"])("autorise le rôle %s", (role) => {
    expect(canUseAdminFrontend(role)).toBe(true);
  });

  it.each(["membre", "invite", ""])("refuse le rôle %s", (role) => {
    expect(canUseAdminFrontend(role)).toBe(false);
  });
});
