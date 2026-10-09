import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BackupRestoreDialog from "@/components/sections/admin/administration/BackupRestoreDialog";
import type { ActionState } from "@/types/administration";
import type { Backup } from "@/types/backup";

const BACKUP: Backup = {
  name: "cie-20260101-120000-manual-abcdefgh.dump",
  origin: "manual",
  createdAt: new Date("2026-01-01T12:00:00Z"),
  sizeBytes: 2048,
};

describe("BackupRestoreDialog", () => {
  it("n'autorise la restauration qu'après la saisie du mot de confirmation", async () => {
    const action = async (): Promise<ActionState> => ({ status: "success", message: "Base restaurée." });
    render(<BackupRestoreDialog backup={BACKUP} action={action} isOpen onClose={() => {}} />);
    const submit = screen.getByRole("button", { name: /restaurer/i });

    await userEvent.type(screen.getByLabelText(/pour confirmer/i), "restaurer");
    expect(submit).toBeDisabled();

    await userEvent.clear(screen.getByLabelText(/pour confirmer/i));
    await userEvent.type(screen.getByLabelText(/pour confirmer/i), "RESTAURER");
    await userEvent.click(submit);

    expect(await screen.findByRole("alert")).toHaveTextContent("Base restaurée.");
    expect(screen.getByRole("button", { name: "Fermer" })).toBeInTheDocument();
  });

  it("affiche l'erreur renvoyée par l'action et garde le formulaire", async () => {
    const action = async (): Promise<ActionState> => ({ status: "error", message: "Une autre opération est en cours." });
    render(<BackupRestoreDialog backup={BACKUP} action={action} isOpen onClose={() => {}} />);

    await userEvent.type(screen.getByLabelText(/pour confirmer/i), "RESTAURER");
    await userEvent.click(screen.getByRole("button", { name: /restaurer/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Une autre opération est en cours.");
    expect(screen.getByLabelText(/pour confirmer/i)).toHaveValue("RESTAURER");
  });
});
