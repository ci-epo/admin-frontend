import type { SelectOption } from "@/types/office-assignment";

export type TreasuryTransactionType = "Entrée" | "Dépense";

/** `RoadEnum` d'`app-service` (`schema.prisma`) : moyen de paiement de l'opération. */
export type Road = "orange_money" | "moov_money" | "banquaire";

/** Ligne affichée dans le journal des transactions (ids résolus, solde courant recalculé). */
export interface TreasuryTransactionRow {
  publicId: string;
  date: Date;
  type: TreasuryTransactionType;
  categoryLabel: string;
  operatorName: string;
  operatorPhone: string;
  operatorWhatsapp: string;
  objectif: string;
  road: Road;
  roadLabel: string;
  /** Signé : positif pour une entrée, négatif pour une dépense. */
  montant: number;
  accountName: string;
  /** Solde du compte juste après cette opération, recalculé côté frontend (pas stocké). */
  soldeApres: number;
}

export interface TreasuryFormOptions {
  accounts: SelectOption[];
  categoriesIn: SelectOption[];
  categoriesOut: SelectOption[];
}

export interface CreateOperatorCommand {
  name: string;
  phoneNumber: string;
  whatsapp: string;
}

export interface CreateTransactionCommand {
  accountId: string;
  categoryId: string;
  operatorId: string;
  description: string;
  road: Road;
  /** `YYYY-MM-DD` : valide pour `@IsDateString()` côté app-service. */
  date: string;
  amount: number;
}
