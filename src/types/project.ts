/** Tag (catalogue commun aux projets) : `ResponseTagDto` d'app-service. */
export interface TagRow {
  publicId: string;
  name: string;
  description: string;
}

/** Projet affiché dans le tableau (`ResponseProjectDto` d'app-service), avec ses tags résolus. */
export interface ProjectRow {
  publicId: string;
  title: string;
  description: string;
  githubUrl: string;
  addressUrl: string;
  isPublic: boolean;
  tags: TagRow[];
}

export interface TagCommand {
  name: string;
  description: string;
}

/** Champs saisis dans le formulaire d'ajout ou de modification. La technologie n'est pas saisie ici (cf. ETAT). */
export interface ProjectCommand {
  title: string;
  description: string;
  githubUrl: string;
  addressUrl: string;
  isPublic: boolean;
}
