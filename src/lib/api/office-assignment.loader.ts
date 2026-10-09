import {
  listMandateOptions,
  listMemberOptions,
  listOfficeAssignments,
  listPositionOptions,
} from "@/lib/api/office-assignment.endpoints";
import type { OfficeAssignmentFormOptions, OfficeAssignmentRow, SelectOption } from "@/types/office-assignment";

export interface OfficeAssignmentBoard {
  rows: OfficeAssignmentRow[];
  options: OfficeAssignmentFormOptions;
}

const EMPTY_BOARD: OfficeAssignmentBoard = {
  rows: [],
  options: { members: [], positions: [], mandates: [] },
};

/** `2026-09-01T00:00:00.000Z` → `2026-09-01` (format attendu par `<input type="date">`). */
function toDateInputValue(isoDate: string): string {
  return isoDate.slice(0, 10);
}

function labelOf(options: readonly SelectOption[], publicId: string, unknownLabel: string): string {
  return options.find((option) => option.publicId === publicId)?.label ?? unknownLabel;
}

/**
 * Tableau « Comptes Admin » du dashboard : les membres/postes/mandats sont chargés une fois (ils servent aussi
 * d'options au formulaire d'ajout) et réutilisés pour résoudre les ids de chaque affectation, sans appel par ligne.
 */
export async function loadOfficeAssignmentBoard(): Promise<OfficeAssignmentBoard> {
  try {
    const [members, positions, mandates, assignments] = await Promise.all([
      listMemberOptions(),
      listPositionOptions(),
      listMandateOptions(),
      listOfficeAssignments(),
    ]);

    const now = new Date();
    const rows: OfficeAssignmentRow[] = assignments.map((assignment) => {
      const member = members.find((option) => option.publicId === assignment.memberId);
      return {
        publicId: assignment.publicId,
        memberId: assignment.memberId,
        memberName: member?.label ?? "Membre inconnu",
        phoneNumber: member?.phoneNumber ?? "",
        positionId: assignment.positionId,
        positionName: labelOf(positions, assignment.positionId, "Poste inconnu"),
        mandateId: assignment.mandateId,
        mandateLabel: labelOf(mandates, assignment.mandateId, "Mandat inconnu"),
        beginDate: toDateInputValue(assignment.beginDate),
        endDate: toDateInputValue(assignment.endDate),
        active: new Date(assignment.beginDate) <= now && now <= new Date(assignment.endDate),
      };
    });

    return { rows, options: { members, positions, mandates } };
  } catch (error) {
    console.warn("[dashboard] tableau des comptes admin indisponible", error);
    return EMPTY_BOARD;
  }
}
