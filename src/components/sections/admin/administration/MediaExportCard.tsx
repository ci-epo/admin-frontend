"use client";

import { useEffect, useState } from "react";
import Alert from "@/components/ui/alert/Alert";
import { parseExportRange } from "@/lib/schemas/media-export.schema";
import { formatBytes } from "@/lib/utils/format-bytes";
import { mediaMessage } from "@/lib/utils/media-messages";

type Preview =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "ready"; mediaCount: number; totalBytes: number }
  | { state: "error"; message: string };

const isoDay = (date: Date): string => date.toISOString().slice(0, 10);

/** Du 1er janvier de l'année en cours à aujourd'hui : la période la plus courante. */
function defaultRange(): { from: string; to: string } {
  const today = new Date();
  return { from: `${today.getUTCFullYear()}-01-01`, to: isoDay(today) };
}

/**
 * Sauvegarde des fichiers (photos, vidéos, archives), que la sauvegarde de la base ne contient pas : une archive ZIP des
 * médias enregistrés entre deux dates. Le nombre de fichiers est annoncé avant le téléchargement.
 */
export default function MediaExportCard() {
  const [{ from, to }, setRange] = useState(defaultRange);
  const [preview, setPreview] = useState<Preview>({ state: "idle" });
  const range = parseExportRange(from, to);

  useEffect(() => {
    if (!range) return;
    const controller = new AbortController();
    // Court délai : on ne questionne pas l'API à chaque touche pendant la saisie d'une date.
    const timer = setTimeout(async () => {
      setPreview({ state: "loading" });
      try {
        const response = await fetch(`/api/media/export/preview?from=${range.from}&to=${range.to}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const body = (await response.json()) as { mediaCount?: number; totalBytes?: number; apiCode?: string; message?: string };
        if (!response.ok) {
          setPreview({ state: "error", message: body.message ?? mediaMessage(body.apiCode, response.status) });
          return;
        }
        setPreview({ state: "ready", mediaCount: body.mediaCount ?? 0, totalBytes: body.totalBytes ?? 0 });
      } catch (error) {
        if ((error as Error).name !== "AbortError") setPreview({ state: "error", message: mediaMessage(undefined, 0) });
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [range?.from, range?.to]); // eslint-disable-line react-hooks/exhaustive-deps -- `range` est recalculé à chaque rendu

  const periodError = !range && from !== "" && to !== "" ? "La date de début doit précéder la date de fin." : null;
  const canDownload = range !== null && preview.state === "ready" && preview.mediaCount > 0;

  return (
    <div className="card mb-0">
      <div className="card-body">
        <h2 className="h6">Exporter les médias</h2>
        <p className="text-muted small">
          Archive ZIP des photos, vidéos et documents <strong>archivés entre deux dates</strong> (date d&apos;envoi), avec
          un fichier <code>index.csv</code>. À conserver avec la sauvegarde de la base, qui ne contient pas les fichiers.
        </p>
        <div className="row g-2 mb-2">
          <div className="col-6">
            <label htmlFor="media-export-from" className="form-label small mb-1">Du</label>
            <input id="media-export-from" type="date" className="form-control" value={from} max={to || undefined}
              onChange={(event) => setRange({ from: event.target.value, to })} />
          </div>
          <div className="col-6">
            <label htmlFor="media-export-to" className="form-label small mb-1">Au (inclus)</label>
            <input id="media-export-to" type="date" className="form-control" value={to} min={from || undefined}
              onChange={(event) => setRange({ from, to: event.target.value })} />
          </div>
        </div>

        <div aria-live="polite" className="small mb-3">
          {periodError && <span className="text-danger">{periodError}</span>}
          {!periodError && !range && <span className="text-muted">Choisissez les deux dates.</span>}
          {range && preview.state === "loading" && <span className="text-muted">Calcul en cours…</span>}
          {range && preview.state === "ready" && preview.mediaCount === 0 && (
            <span className="text-muted">Aucun média archivé sur cette période.</span>
          )}
          {range && preview.state === "ready" && preview.mediaCount > 0 && (
            <span>
              <strong>{preview.mediaCount}</strong> {preview.mediaCount > 1 ? "médias" : "média"}, environ{" "}
              <strong>{formatBytes(preview.totalBytes)}</strong>.
            </span>
          )}
        </div>
        {preview.state === "error" && <Alert variant="danger" icon="ri-error-warning-line" message={preview.message} className="mb-3" />}

        {canDownload && range ? (
          <a className="btn btn-primary" href={`/api/media/export?from=${range.from}&to=${range.to}`} download>
            <i className="ri-download-2-line me-1" aria-hidden="true"></i>Télécharger l&apos;archive ZIP
          </a>
        ) : (
          <button type="button" className="btn btn-primary" disabled>
            <i className="ri-download-2-line me-1" aria-hidden="true"></i>Télécharger l&apos;archive ZIP
          </button>
        )}
        <p className="text-muted small mt-2 mb-0">
          Un seul export à la fois. Les vidéos étant déjà compressées, l&apos;archive pèse à peu près autant que les
          fichiers eux-mêmes ; gardez de la place sur le disque qui reçoit le téléchargement.
        </p>
      </div>
    </div>
  );
}
