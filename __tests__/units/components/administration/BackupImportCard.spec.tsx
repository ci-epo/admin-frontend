import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BackupImportCard from "@/components/sections/admin/administration/BackupImportCard";
import { BACKUP_UPLOAD_MAX_BYTES } from "@/lib/schemas/backup.schema";
import type { ActionState } from "@/types/administration";

const idle = async (): Promise<ActionState> => ({ status: "idle" });

function dumpFile(size: number): File {
  const file = new File(["PGDMP"], "cie.dump", { type: "application/octet-stream" });
  Object.defineProperty(file, "size", { value: size });
  return file;
}

describe("BackupImportCard", () => {
  it("refuse un fichier trop volumineux avant tout envoi", async () => {
    render(<BackupImportCard action={idle} />);

    await userEvent.upload(screen.getByLabelText("Fichier de sauvegarde"), dumpFile(BACKUP_UPLOAD_MAX_BYTES + 1));

    expect(screen.getByText(/trop volumineux/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /importer/i })).toBeDisabled();
  });

  it("accepte un fichier sous la limite", async () => {
    render(<BackupImportCard action={idle} />);

    await userEvent.upload(screen.getByLabelText("Fichier de sauvegarde"), dumpFile(1024));

    expect(screen.queryByText(/trop volumineux/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /importer/i })).toBeEnabled();
  });
});
