import { MEDIA_MAX_BYTES, mimeTypeFor } from "@/lib/schemas/media.schema";

describe("mimeTypeFor", () => {
  it("déduit le type MIME de l'extension quand le navigateur n'en donne pas", () => {
    expect(mimeTypeFor("PHOTO", { name: "match.JPG", type: "" })).toBe("image/jpeg");
    expect(mimeTypeFor("VIDEO", { name: "seance.mp4", type: "" })).toBe("video/mp4");
    expect(mimeTypeFor("DOCUMENT", { name: "pv.pdf", type: "application/pdf" })).toBe("application/pdf");
  });

  it("refuse une extension non acceptée pour la nature", () => {
    expect(mimeTypeFor("VIDEO", { name: "seance.mov", type: "video/quicktime" })).toBeNull();
    expect(mimeTypeFor("PHOTO", { name: "doc.pdf", type: "" })).toBeNull();
    expect(mimeTypeFor("PHOTO", { name: "sans-extension", type: "" })).toBeNull();
  });

  it("refuse un type annoncé incohérent avec l'extension", () => {
    expect(mimeTypeFor("PHOTO", { name: "faux.jpg", type: "image/png" })).toBeNull();
  });

  it("garde les plafonds alignés sur app-service", () => {
    expect(MEDIA_MAX_BYTES.VIDEO).toBe(250 * 1024 * 1024);
  });
});
