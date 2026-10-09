/** Champ réel de `Member`, choisi à la création/modification. */
export type MemberBaseType = "MEMBER" | "PARTNER";

/** Type affiché : combine le champ réel `type` et le statut de bureau (calculé, pas stocké). */
export type MemberDisplayType = "Membre" | "Bureau" | "AncienBureau" | "Partenaire";

export interface Member {
  publicId: string;
  name: string;
  firstName: string;
  phoneNumber: string;
  email: string;
  type: MemberBaseType;
  createdAt: Date;
}

/** Ligne affichée dans le tableau des membres. */
export interface MemberRow extends Member {
  displayType: MemberDisplayType;
}

export interface CreateMemberCommand {
  name: string;
  firstName: string;
  phoneNumber: string;
  email: string;
  type?: MemberBaseType;
  /** Renseigné : crée aussi le compte de connexion du membre (app-service). */
  password?: string;
}

export type UpdateMemberCommand = Partial<CreateMemberCommand>;
