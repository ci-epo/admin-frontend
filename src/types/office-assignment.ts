/** Option d'un menu déroulant (membre, poste ou mandat) pour le formulaire d'ajout du bureau. */
export interface SelectOption {
  publicId: string;
  label: string;
}

export interface MemberOption extends SelectOption {
  phoneNumber: string;
}

export interface OfficeAssignmentFormOptions {
  members: MemberOption[];
  positions: SelectOption[];
  mandates: SelectOption[];
}

/** Ligne affichée dans le tableau « Comptes Admin » (résolue à partir des ids d'une affectation). */
export interface OfficeAssignmentRow {
  publicId: string;
  memberName: string;
  memberId: string;
  positionName: string;
  positionId: string;
  phoneNumber: string;
  mandateLabel: string;
  mandateId: string;
  /** Dates au format `YYYY-MM-DD`, prêtes pour un `<input type="date">`. */
  beginDate: string;
  endDate: string;
  /** `true` si aujourd'hui est entre `beginDate` et `endDate` — pas un champ de la base, calculé à l'affichage. */
  active: boolean;
}

export interface CreateOfficeAssignmentCommand {
  memberId: string;
  positionId: string;
  mandateId: string;
  beginDate: string;
  endDate: string;
}

/** Modification d'une affectation : le membre n'est pas modifiable (cf. `EditOfficeAssignmentModal`). */
export interface UpdateOfficeAssignmentCommand {
  positionId: string;
  mandateId: string;
  beginDate: string;
  endDate: string;
}
