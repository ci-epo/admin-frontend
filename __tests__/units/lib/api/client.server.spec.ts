/**
 * @jest-environment node
 */
import { apiClient } from "@/lib/api/client";

const jsonResponse = (status: number, body: unknown) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: new Headers({ "content-type": "application/json" }),
  json: async () => body,
});

describe("apiClient (côté serveur)", () => {
  const initial = process.env.API_INTERNAL_BASE_URL;

  afterEach(() => {
    process.env.API_INTERNAL_BASE_URL = initial;
    jest.restoreAllMocks();
  });

  it("appelle l'URL interne de l'API en gardant son préfixe /api", async () => {
    process.env.API_INTERNAL_BASE_URL = "http://api:3000/api/";
    const fetchMock = jest.fn().mockResolvedValue(jsonResponse(200, {}));
    global.fetch = fetchMock;

    await apiClient({ path: "/site-settings/web", method: "GET" });

    expect(fetchMock.mock.calls[0][0]).toBe("http://api:3000/api/site-settings/web");
  });

  it("retombe sur l'URL publique sans URL interne", async () => {
    delete process.env.API_INTERNAL_BASE_URL;
    const fetchMock = jest.fn().mockResolvedValue(jsonResponse(200, {}));
    global.fetch = fetchMock;

    await apiClient({ path: "/backups", method: "GET" });

    expect(fetchMock.mock.calls[0][0]).toBe(`${process.env.NEXT_PUBLIC_API_BASE_URL}/backups`);
  });

  it("expose le code métier renvoyé par app-service", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      jsonResponse(409, { statusCode: 409, code: "BACKUP_OPERATION_IN_PROGRESS", message: "BACKUP_OPERATION_IN_PROGRESS" }),
    );

    await expect(apiClient({ path: "/backups", method: "POST" })).rejects.toMatchObject({
      code: "CONFLICT",
      apiCode: "BACKUP_OPERATION_IN_PROGRESS",
    });
  });
});
