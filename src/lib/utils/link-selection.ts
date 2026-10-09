/** Une liaison existante (rôle ↔ permission, projet ↔ tag…) : `targetId` est le `publicId` de l'élément lié. */
export interface LinkRef {
  /** `publicId` de la liaison elle-même (cible d'un DELETE). */
  linkId: string;
  targetId: string;
}

export interface LinkChanges {
  /** `publicId` des éléments à lier. */
  toCreate: string[];
  /** `publicId` des liaisons à supprimer. */
  toDelete: string[];
}

/** Compare les cases cochées aux liaisons existantes : seules les différences partent vers l'API. */
export function computeLinkChanges(current: readonly LinkRef[], selected: readonly string[]): LinkChanges {
  const wanted = new Set(selected);
  const existing = new Set(current.map((link) => link.targetId));
  return {
    toCreate: [...wanted].filter((targetId) => !existing.has(targetId)),
    toDelete: current.filter((link) => !wanted.has(link.targetId)).map((link) => link.linkId),
  };
}
