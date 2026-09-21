export { default as Header } from "@/components/sections/admin/header/Header";
export { default as NotificationsDropdown } from "@/components/sections/admin/header/NotificationsDropdown";
export { default as CartDropdown } from "@/components/sections/admin/header/CartDropdown";
export { default as ProfileMenu } from "@/components/sections/admin/header/ProfileMenu";
export { default as SearchModal } from "@/components/sections/admin/header/SearchModal";
export { default as DarkModeToggle } from "@/components/sections/admin/header/DarkModeToggle";

export { CURRENT_USER, NOTIFICATIONS, CART_ITEMS } from "@/components/sections/admin/header/mockData";
export type {
  NotificationItem,
  NotificationKind,
  CartItem,
  UserProfile,
} from "@/components/sections/admin/header/types";
