export type TreasuryTransactionType = "Entrée" | "Dépense";

export interface TreasuryTransaction {
  id: string;
  date: string;
  type: TreasuryTransactionType;
  nom: string;
  role: string;
  contact: string;
  objectif: string;
  montant: number;
  /** Solde total des finances après cette transaction */
  soldeApres: number;
}
