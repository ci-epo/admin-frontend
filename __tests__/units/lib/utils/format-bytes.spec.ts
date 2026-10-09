import { formatBytes } from "@/lib/utils/format-bytes";

const normalize = (value: string) => value.replace(/ | /g, " ");

describe("formatBytes", () => {
  it("retourne une taille lisible en unités binaires", () => {
    expect(normalize(formatBytes(512))).toBe("512 o");
    expect(normalize(formatBytes(1536))).toBe("1,5 Ko");
    expect(normalize(formatBytes(5 * 1024 * 1024))).toBe("5 Mo");
    expect(normalize(formatBytes(150 * 1024 * 1024))).toBe("150 Mo");
  });
});
