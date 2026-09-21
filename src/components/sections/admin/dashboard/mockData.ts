/**
 * Données mock pour le dashboard. À remplacer par des appels API
 * (Server Component fetch ou Client Component avec SWR/React Query).
 *
 * Fichier .ts (pas .tsx) : aucune logique de rendu ici, uniquement des données.
 */

import type {
    Order,
    ProductCategory,
    CountryGrowth,
    CountryBubble,
  } from "@/types/dashboard";
import type { StatItem } from "@/types/stat";
  
  export const STATS: StatItem[] = [
    {
      icon: "bi bi-folder2-open",
      value: "647",
      label: "Total membres actuel",
      captionHighlight: "+8%",
      caption: "Annee precedente",
      trend: "up",
    },
    {
      icon: "bi bi-bookmark",
      value: "3",
      label: "Projet en cours",
      captionHighlight: "2",
      caption: "completes",
      highlightColor: "success",
    },
    {
      icon: "bi bi-bookmark",
      value: "47 000",
      label: "Caisse",
      highlightColor: "success",
      trend: "down",
    },
  ];
  
  export const ORDERS: Order[] = [
    {
      id: "#0051134",
      email: "ela@septi.gmail.com",
      product: "MacBook Air",
      status: "Actif",
      tracking: "PQ1132G",
      avatarUrl: "/assets/images/avatar/avatar-1.jpg",
    },
    {
      id: "#0021598",
      email: "te@shroff.gmail.com",
      product: "Magical Pen",
      status: "Actif",
      tracking: "CF0568B",
      avatarUrl: "/assets/images/avatar/avatar-2.jpg",
      checked: true,
    },
    {
      id: "#0045976",
      email: "te@shroff.gmail.com",
      product: "Secret Diary",
      status: "Inactif",
      tracking: "RY4578K",
      avatarUrl: "/assets/images/avatar/avatar-3.jpg",
    },
    {
      id: "#0074564",
      email: "te@shroff.gmail.com",
      product: "IdeaPad Azure",
      status: "Actif",
      tracking: "ST9856H",
      avatarUrl: "/assets/images/avatar/avatar-4.jpg",
    },
    {
      id: "#0098546",
      email: "te@shroff.gmail.com",
      product: "Laxmi Electric Stove",
      status: "Actif",
      tracking: "KI1256G",
      avatarUrl: "/assets/images/avatar/avatar-5.jpg",
    },
  ];
  
  export const PRODUCT_CATEGORIES: ProductCategory[] = [
    {
      name: "Electronic",
      icon: "ri-ram-line",
      count: 2482,
      change: "+5.34%",
      variant: "primary",
    },
    {
      name: "Games",
      icon: "bi bi-controller",
      count: 1828,
      change: "+5.34%",
      variant: "warning",
    },
    {
      name: "Furniture",
      icon: "bi bi-lamp",
      count: 1463,
      change: "+5.34%",
      variant: "danger",
    },
  ];
  
  export const COUNTRY_BUBBLES: CountryBubble[] = [
    { value: "2,489", index: 1 },
    { value: "1,756", index: 2 },
    { value: "285", index: 3 },
    { value: "812", index: 4 },
  ];
  
  export const COUNTRIES: CountryGrowth[] = [
    { name: "United States", flagUrl: "/assets/images/flag/us.svg", percent: 90 },
    { name: "Andorra", flagUrl: "/assets/images/flag/de.svg", percent: 70 },
    { name: "French", flagUrl: "/assets/images/flag/ru.svg", percent: 70 },
    { name: "Chinese", flagUrl: "/assets/images/flag/cn.svg", percent: 25 },
  ];