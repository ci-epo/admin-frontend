/** Minuscules, sans accents ni espaces superflus : « Chargé » et « charge » se comparent à égalité. */
export function normalizeSearchText(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

/**
 * Filtre une liste déjà chargée sur une saisie libre. Chaque mot de la saisie doit apparaître dans au moins
 * un des champs renvoyés par `fields` (ex. « sissao ext » trouve le membre SISSAO au poste CR-EXT).
 * Une saisie vide renvoie la liste complète.
 */
export function filterBySearch<T>(items: readonly T[], query: string, fields: (item: T) => readonly string[]): T[] {
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [...items];

  return items.filter((item) => {
    const haystack = normalizeSearchText(fields(item).join(" "));
    return terms.every((term) => haystack.includes(term));
  });
}
