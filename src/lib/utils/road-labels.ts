import type { Road } from "@/types/treasury";

/** `RoadEnum` d'`app-service` (`schema.prisma`) : libellé du moyen de paiement. */
export const ROAD_LABELS: Record<Road, string> = {
  orange_money: "Orange Money",
  moov_money: "Moov Money",
  banquaire: "Bancaire",
};
