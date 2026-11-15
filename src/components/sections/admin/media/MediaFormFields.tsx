import Input from "@/components/ui/form/input/Input";
import Textarea from "@/components/ui/form/textarea/Textarea";
import { PLACEMENT_LABELS } from "@/lib/schemas/media.schema";
import type { MediaKind, MediaPlacement, MediaRow } from "@/types/media";

interface MediaFormFieldsProps {
  kind: MediaKind;
  /** Présent : modification (valeurs initiales et ordre d'affichage). Absent : envoi. */
  media?: MediaRow;
  idPrefix: string;
  fieldError: (name: string) => string | undefined;
}

const PLACEMENTS = Object.keys(PLACEMENT_LABELS) as MediaPlacement[];

/** Champs de la fiche d'un média ; ceux qui n'ont pas de sens pour la nature choisie sont masqués. */
export default function MediaFormFields({ kind, media, idPrefix, fieldError }: MediaFormFieldsProps) {
  const isDocument = kind === "DOCUMENT";

  return (
    <>
      <Input
        id={`${idPrefix}-title`}
        name="title"
        label="Titre"
        defaultValue={media?.title}
        error={fieldError("title")}
        maxLength={120}
        wrapperClass="mb-3"
        required
      />

      {isDocument ? (
        <div className="row g-3 mb-3">
          <div className="col-sm-8">
            <Input
              id={`${idPrefix}-category`}
              name="category"
              label="Catégorie"
              defaultValue={media?.category}
              error={fieldError("category")}
              maxLength={60}
              placeholder="Compte rendu, rapport, affiche…"
            />
          </div>
          <div className="col-sm-4">
            <Input
              id={`${idPrefix}-year`}
              name="year"
              type="number"
              label="Année"
              defaultValue={media?.year ?? new Date().getFullYear()}
              error={fieldError("year")}
              min={1990}
              max={2100}
            />
          </div>
        </div>
      ) : (
        <>
          <Input
            id={`${idPrefix}-tag`}
            name="tag"
            label="Étiquette"
            defaultValue={media?.tag}
            error={fieldError("tag")}
            maxLength={40}
            placeholder="Électronique, Entraide, Projet…"
            wrapperClass="mb-3"
          />
          <Textarea
            id={`${idPrefix}-caption`}
            name="caption"
            label="Phrase d'accompagnement"
            defaultValue={media?.caption}
            rows={3}
            maxLength={400}
            wrapperClass="mb-1"
          />
          {fieldError("caption") && <div className="invalid-feedback d-block mb-2">{fieldError("caption")}</div>}
          <p className="text-muted small mb-3">Affichée sous le titre, sur le site.</p>
          {kind === "PHOTO" && (
            <Input
              id={`${idPrefix}-alt`}
              name="alt"
              label="Description de l'image (accessibilité)"
              defaultValue={media?.alt}
              error={fieldError("alt")}
              maxLength={200}
              wrapperClass="mb-3"
            />
          )}
          <div className="row g-3 mb-3">
            <div className={media ? "col-sm-8" : "col-12"}>
              <label className="form-label" htmlFor={`${idPrefix}-placement`}>
                Où l&apos;afficher sur le site
              </label>
              <select
                id={`${idPrefix}-placement`}
                name="placement"
                className="form-select"
                defaultValue={media?.placement ?? "BOTH"}
              >
                {PLACEMENTS.map((placement) => (
                  <option key={placement} value={placement}>
                    {PLACEMENT_LABELS[placement]}
                  </option>
                ))}
              </select>
            </div>
            {media && (
              <div className="col-sm-4">
                <Input
                  id={`${idPrefix}-order`}
                  name="sortOrder"
                  type="number"
                  label="Ordre"
                  defaultValue={media.sortOrder}
                  error={fieldError("sortOrder")}
                  min={-9999}
                  max={9999}
                />
              </div>
            )}
          </div>
          <div className="form-check mb-1">
            <input
              id={`${idPrefix}-published`}
              type="checkbox"
              name="isPublished"
              className="form-check-input"
              defaultChecked={media?.isPublished ?? true}
            />
            <label className="form-check-label" htmlFor={`${idPrefix}-published`}>
              Visible sur le site public
            </label>
          </div>
          {media && <p className="text-muted small mb-0">L&apos;ordre le plus petit s&apos;affiche en premier.</p>}
        </>
      )}
    </>
  );
}
