import { listAccounts, listCategories, listOperators, listTransactions } from "@/lib/api/treasury.endpoints";
import type { AccountDto, CategoryDto, TransactionDto } from "@/lib/schemas/treasury.schema";
import { formatMontant, formatSolde } from "@/lib/utils/format-currency";
import { ROAD_LABELS } from "@/lib/utils/road-labels";
import type { SelectOption } from "@/types/office-assignment";
import type { StatItem } from "@/types/stat";
import type { TreasuryFormOptions, TreasuryTransactionRow } from "@/types/treasury";

export interface TreasuryBoard {
  stats: StatItem[];
  rows: TreasuryTransactionRow[];
  options: TreasuryFormOptions;
}

function unavailableStat(icon: string, label: string): StatItem {
  return { icon, value: "—", label, caption: "Indisponible", highlightColor: "danger", trend: "none" };
}

const EMPTY_BOARD: TreasuryBoard = {
  stats: [
    unavailableStat("ri-wallet-3-line", "Montant actuel"),
    unavailableStat("ri-arrow-left-down-line", "Entrées"),
    unavailableStat("ri-arrow-right-up-line", "Dépenses"),
  ],
  rows: [],
  options: { accounts: [], categoriesIn: [], categoriesOut: [] },
};

/** Montant signé d'une transaction : positif pour une catégorie « entrée », négatif pour une « sortie ». */
function signedAmount(transaction: TransactionDto, categoryById: Map<string, CategoryDto>): number {
  const isIn = categoryById.get(transaction.categoryId)?.type === "entree";
  return isIn ? transaction.amount : -transaction.amount;
}

/**
 * Solde du compte juste après chaque transaction, par `publicId` de transaction. Reconstruit en remontant depuis
 * le solde courant du compte (source de vérité, tenu à jour par `app-service` à chaque création/suppression) :
 * aucune donnée inventée, seulement une répartition chronologique du solde déjà réel.
 */
function computeSoldeApres(
  accounts: AccountDto[],
  transactions: TransactionDto[],
  categoryById: Map<string, CategoryDto>,
): Map<string, number> {
  const soldeByTransaction = new Map<string, number>();
  const accountById = new Map(accounts.map((account) => [account.publicId, account]));

  const byAccount = new Map<string, TransactionDto[]>();
  for (const transaction of transactions) {
    const list = byAccount.get(transaction.accountId) ?? [];
    list.push(transaction);
    byAccount.set(transaction.accountId, list);
  }

  for (const [accountId, accountTransactions] of byAccount) {
    const account = accountById.get(accountId);
    if (!account) continue;

    const sorted = [...accountTransactions].sort(
      (a, b) => a.date.getTime() - b.date.getTime() || a.publicId.localeCompare(b.publicId),
    );
    const totalDelta = sorted.reduce((sum, transaction) => sum + signedAmount(transaction, categoryById), 0);

    let running = account.balance - totalDelta;
    for (const transaction of sorted) {
      running += signedAmount(transaction, categoryById);
      soldeByTransaction.set(transaction.publicId, running);
    }
  }

  return soldeByTransaction;
}

function monthKey(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

/** Somme des montants (non signés) du mois donné, pour un type de catégorie (entrée/sortie). */
function sumForMonth(
  transactions: TransactionDto[],
  categoryById: Map<string, CategoryDto>,
  type: "entree" | "sortie",
  month: number,
): number {
  return transactions
    .filter((t) => categoryById.get(t.categoryId)?.type === type && monthKey(t.date) === month)
    .reduce((sum, t) => sum + t.amount, 0);
}

function buildFlowStat(params: {
  icon: string;
  label: string;
  highlightColor: "success" | "danger";
  sign: 1 | -1;
  thisMonth: number;
  lastMonth: number;
}): StatItem {
  const { icon, label, highlightColor, sign, thisMonth, lastMonth } = params;
  const stat: StatItem = {
    icon,
    value: formatMontant(sign * thisMonth),
    label,
    caption: "par rapport au mois dernier",
    highlightColor,
    trend: "none",
  };
  if (lastMonth > 0) {
    const pct = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
    stat.captionHighlight = `${pct >= 0 ? "+" : ""}${pct}%`;
    stat.trend = pct >= 0 ? "up" : "down";
  }
  return stat;
}

function buildStats(
  accounts: AccountDto[],
  transactions: TransactionDto[],
  categoryById: Map<string, CategoryDto>,
): StatItem[] {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const now = new Date();
  const thisMonth = monthKey(now);
  const lastMonth = thisMonth - 1;

  return [
    {
      icon: "ri-wallet-3-line",
      value: formatSolde(totalBalance),
      label: "Montant actuel",
      caption: "Solde consolidé des caisses",
      trend: "none",
    },
    buildFlowStat({
      icon: "ri-arrow-left-down-line",
      label: "Entrées",
      highlightColor: "success",
      sign: 1,
      thisMonth: sumForMonth(transactions, categoryById, "entree", thisMonth),
      lastMonth: sumForMonth(transactions, categoryById, "entree", lastMonth),
    }),
    buildFlowStat({
      icon: "ri-arrow-right-up-line",
      label: "Dépenses",
      highlightColor: "danger",
      sign: -1,
      thisMonth: sumForMonth(transactions, categoryById, "sortie", thisMonth),
      lastMonth: sumForMonth(transactions, categoryById, "sortie", lastMonth),
    }),
  ];
}

function toOption(item: { publicId: string; name: string }): SelectOption {
  return { publicId: item.publicId, label: item.name };
}

/**
 * Grille de la page Trésorerie : comptes, catégories, opérateurs et transactions sont chargés une fois et
 * recombinés en mémoire (solde courant par ligne, statistiques), sans appel par ligne. Résilient : une panne de
 * l'API laisse la page utilisable (tableau vide, cartes « Indisponible »).
 */
export async function loadTreasuryBoard(): Promise<TreasuryBoard> {
  try {
    const [accounts, categories, operators, transactions] = await Promise.all([
      listAccounts(),
      listCategories(),
      listOperators(),
      listTransactions(),
    ]);

    const accountById = new Map(accounts.map((account) => [account.publicId, account]));
    const categoryById = new Map(categories.map((category) => [category.publicId, category]));
    const operatorById = new Map(operators.map((operator) => [operator.publicId, operator]));
    const soldeApresByTransaction = computeSoldeApres(accounts, transactions, categoryById);

    const rows: TreasuryTransactionRow[] = transactions
      .map((transaction): TreasuryTransactionRow => {
        const category = categoryById.get(transaction.categoryId);
        const operator = operatorById.get(transaction.operatorId);
        const account = accountById.get(transaction.accountId);
        const isIn = category?.type === "entree";

        return {
          publicId: transaction.publicId,
          date: transaction.date,
          type: isIn ? "Entrée" : "Dépense",
          categoryLabel: category?.name ?? "Catégorie inconnue",
          operatorName: operator?.name ?? "Opérateur inconnu",
          operatorPhone: operator?.phoneNumber ?? "—",
          operatorWhatsapp: operator?.whatsapp ?? "—",
          objectif: transaction.description,
          road: transaction.road,
          roadLabel: ROAD_LABELS[transaction.road],
          montant: signedAmount(transaction, categoryById),
          accountName: account?.name ?? "Caisse inconnue",
          soldeApres: soldeApresByTransaction.get(transaction.publicId) ?? account?.balance ?? 0,
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    const options: TreasuryFormOptions = {
      accounts: accounts.map(toOption),
      categoriesIn: categories.filter((c) => c.type === "entree").map(toOption),
      categoriesOut: categories.filter((c) => c.type === "sortie").map(toOption),
    };

    return { stats: buildStats(accounts, transactions, categoryById), rows, options };
  } catch (error) {
    console.warn("[treasury] grille de trésorerie indisponible", error);
    return EMPTY_BOARD;
  }
}
