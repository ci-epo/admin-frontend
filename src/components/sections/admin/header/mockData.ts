/**
 * Données mock pour le header (notifications, panier, profil).
 * À remplacer par des appels API ou un store global (Zustand, Context).
 */

import type {
  NotificationItem,
  CartItem,
} from "@/components/sections/admin/header/types";

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    kind: "stock",
    title: "Item Back in Stock",
    date: "Today, 02:45 PM",
    detail:
      "Good news! The item you wanted is back in stock. Grab it before it's gone again!",
    icon: "bi bi-bag-check-fill",
    iconBg: "bg-success-subtle text-success",
  },
  {
    id: "n2",
    kind: "like",
    actor: "Donald",
    actorIcon: "ri-heart-3-fill text-danger ms-1",
    date: "Friday, 11:29 PM",
    avatarUrl: "/assets/images/avatar/avatar-8.jpg",
  },
  {
    id: "n3",
    kind: "birthday",
    title: "Birthday Reminder",
    date: "Tuesday, 02:45 PM",
    detail:
      "Don't forget! It's Emily birthday tomorrow. Send them a message!",
    icon: "bi bi-fire",
    iconBg: "bg-danger-subtle text-danger",
  },
  {
    id: "n4",
    kind: "share",
    actor: "Richard",
    actorIcon: "bi bi-person-plus-fill text-primary fs-16 ms-1",
    date: "Monday, 07:14 AM",
    avatarUrl: "/assets/images/avatar/avatar-5.jpg",
  },
  {
    id: "n5",
    kind: "file",
    actor: "Mia",
    title: "shared a file in Marketing Campaign",
    date: "Thursday 3:20 PM",
    avatarUrl: "/assets/images/avatar/avatar-1.jpg",
    attachment: {
      name: "Campaign_Strategy.mp4",
      size: "MP4 | 14 MB",
      icon: "bi bi-file-pdf",
    },
  },
];

export const CART_ITEMS: CartItem[] = [
  {
    id: "c1",
    name: "Stop Watch",
    imageUrl: "/assets/images/product/img-02.png",
    quantity: 2,
    unitPrice: 159,
    href: "/apps/ecommerce/products-details",
  },
  {
    id: "c2",
    name: "Jeens Shoes",
    imageUrl: "/assets/images/product/img-03.png",
    quantity: 1,
    unitPrice: 399,
    href: "/apps/ecommerce/products-details",
  },
  {
    id: "c3",
    name: "Solder Less T-shirt",
    imageUrl: "/assets/images/product/img-04.png",
    quantity: 3,
    unitPrice: 259,
    href: "/apps/ecommerce/products-details",
  },
];