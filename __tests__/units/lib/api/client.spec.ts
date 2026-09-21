import { apiClient } from "@/lib/api/client";

const jsonResponse = (status: number, body: unknown) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: new Headers({ "content-type": "application/json" }),
  json: async () => body,
});

describe("apiClient", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("mappe un 404 en NOT_FOUND", async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse(404, { message: "Membre introuvable" }));

    await expect(apiClient({ path: "/members/x", method: "GET" })).rejects.toMatchObject({
      code: "NOT_FOUND",
      status: 404,
      message: "Membre introuvable",
    });
  });

  it("mappe un 500 en SERVER_ERROR", async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse(500, {}));

    await expect(apiClient({ path: "/members", method: "GET" })).rejects.toMatchObject({
      code: "SERVER_ERROR",
    });
  });

  it("retourne la charge utile JSON d'une réponse réussie", async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse(200, { status: "ok" }));

    await expect(apiClient({ path: "/health", method: "GET" })).resolves.toEqual({ status: "ok" });
  });

  it("normalise une panne réseau en NETWORK_ERROR", async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError("fetch failed"));

    await expect(apiClient({ path: "/health", method: "GET" })).rejects.toMatchObject({
      code: "NETWORK_ERROR",
      status: 0,
    });
  });
});
