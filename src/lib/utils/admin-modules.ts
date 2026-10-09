import type { AdminModule } from "@/types/administration";

interface NavigableItem {
  label: string;
  href?: string;
  permission?: string;
}

interface NavigableSection<T extends NavigableItem> {
  items: T[];
}

/** Pages toujours accessibles : l'accueil de l'admin et l'administration elle-même (sinon, plus moyen de revenir). */
const LOCKED_ROUTES = new Set(["/dashboard", "/administration"]);

/** Clé d'un module = segment d'URL de sa page (`/treasury` → `treasury`). */
export function moduleKeyOf(href: string): string {
  return href.replace(/^\/+/, "").split("/")[0];
}

/** Modules du menu qu'on peut désactiver, dans l'ordre du menu. */
export function toggleableModules<T extends NavigableItem>(sections: NavigableSection<T>[]): AdminModule[] {
  return sections
    .flatMap((section) => section.items)
    .filter((item): item is T & { href: string } => !!item.href && !LOCKED_ROUTES.has(item.href))
    .map((item) => ({ key: moduleKeyOf(item.href), label: item.label }));
}

/** Retire du menu les modules désactivés (et les sections devenues vides). */
export function withoutHiddenModules<T extends NavigableItem, S extends NavigableSection<T>>(
  sections: S[],
  hiddenModules: string[],
): S[] {
  const hidden = new Set(hiddenModules);
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.href || LOCKED_ROUTES.has(item.href) || !hidden.has(moduleKeyOf(item.href)),
      ),
    }))
    .filter((section) => section.items.length > 0);
}

/** Retire du menu les entrées dont la permission requise manque (et les sections devenues vides). */
export function withoutUnauthorizedModules<T extends NavigableItem, S extends NavigableSection<T>>(
  sections: S[],
  permissions: string[],
): S[] {
  const granted = new Set(permissions);
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.permission || granted.has(item.permission)),
    }))
    .filter((section) => section.items.length > 0);
}
