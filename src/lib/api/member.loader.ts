import { listMembers } from "@/lib/api/member.endpoints";
import { listOfficeAssignments } from "@/lib/api/office-assignment.endpoints";
import { isOfficeAssignmentActive } from "@/lib/utils/office-assignment-status";
import type { MemberDisplayType, MemberRow } from "@/types/member";

/**
 * Tableau des membres : le type affiché combine le champ réel `type` (Membre/Partenaire) et le statut de
 * bureau, calculé à partir des affectations (pas un champ stocké) :
 * - `Partenaire` si `type === "PARTNER"` (jamais recatégorisé, un partenaire n'occupe pas de poste) ;
 * - sinon `Bureau` si une affectation n'a pas dépassé sa date de fin (même règle que le dashboard), `Ancien Bureau`
 *   s'il en a eu une mais qu'elle est expirée, `Membre` s'il n'en a jamais eu.
 * Les deux appels (`members`, `office-assignments`) sont indépendants : si les affectations ne peuvent pas être
 * chargées, la liste des membres s'affiche quand même (tous en « Membre », faute de mieux).
 */
export async function loadMemberBoard(): Promise<MemberRow[]> {
  let members: Awaited<ReturnType<typeof listMembers>> = [];
  try {
    members = await listMembers();
  } catch (error) {
    console.warn("[member] liste des membres indisponible", error);
    return [];
  }

  const activeMemberIds = new Set<string>();
  const everAssignedMemberIds = new Set<string>();
  try {
    const assignments = await listOfficeAssignments();
    const now = new Date();
    for (const assignment of assignments) {
      everAssignedMemberIds.add(assignment.memberId);
      if (isOfficeAssignmentActive(assignment.endDate, now)) {
        activeMemberIds.add(assignment.memberId);
      }
    }
  } catch (error) {
    console.warn("[member] affectations de bureau indisponibles (colonne Type réduite à 'Membre')", error);
  }

  return members.map((member) => {
    let displayType: MemberDisplayType;
    if (member.type === "PARTNER") {
      displayType = "Partenaire";
    } else if (activeMemberIds.has(member.publicId)) {
      displayType = "Bureau";
    } else if (everAssignedMemberIds.has(member.publicId)) {
      displayType = "AncienBureau";
    } else {
      displayType = "Membre";
    }
    return { ...member, displayType };
  });
}
