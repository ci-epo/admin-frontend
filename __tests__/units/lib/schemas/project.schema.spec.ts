import { isHttpUrl, parseProjectForm } from "@/lib/schemas/project.schema";

const formOf = (values: Record<string, string>) => {
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) form.set(key, value);
  return form;
};

const valid = {
  title: "Portfolio",
  description: "Mon projet",
  githubUrl: "https://github.com/org/repo",
  addressUrl: "https://demo.example.com",
};

describe("parseProjectForm", () => {
  it("accepte un projet complet, privé par défaut", () => {
    expect(parseProjectForm(formOf(valid))).toEqual({ ok: true, data: { ...valid, isPublic: false, tagIds: [] } });
  });

  it("lit les tags cochés", () => {
    const form = formOf(valid);
    form.append("tag", "tagA");
    form.append("tag", "tagB");
    expect(parseProjectForm(form)).toMatchObject({ ok: true, data: { tagIds: ["tagA", "tagB"] } });
  });

  it("lit la visibilité publique depuis la case cochée", () => {
    expect(parseProjectForm(formOf({ ...valid, isPublic: "on" }))).toMatchObject({
      ok: true,
      data: { isPublic: true },
    });
  });

  it("signale titre et description vides", () => {
    const result = parseProjectForm(formOf({ ...valid, title: "  ", description: "" }));
    expect(result).toMatchObject({
      ok: false,
      fieldErrors: { title: expect.any(String), description: expect.any(String) },
    });
  });

  it("refuse un lien sans schéma http(s)", () => {
    const result = parseProjectForm(
      formOf({ ...valid, githubUrl: "github.com/a/b", addressUrl: "javascript:alert(1)" }),
    );
    expect(result).toMatchObject({
      ok: false,
      fieldErrors: { githubUrl: expect.any(String), addressUrl: expect.any(String) },
    });
  });
});

describe("isHttpUrl", () => {
  it.each(["https://a.example", "http://localhost:3000/x"])("accepte %s", (value) => {
    expect(isHttpUrl(value)).toBe(true);
  });

  it.each(["", "a.example", "ftp://a.example", "not a url"])("refuse %s", (value) => {
    expect(isHttpUrl(value)).toBe(false);
  });
});
