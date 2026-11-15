import { notFound } from "next/navigation";
import { isModuleDisabled } from "@/lib/api/administration.endpoints";
import { getCurrentAccess, hasPermission } from "@/lib/auth/current-access";
import { loadMedia } from "@/lib/api/media.loader";
import ArchiveBoard from "@/components/sections/admin/media/ArchiveBoard";
import { deleteMediaAction, updateMediaAction } from "@/app/(admin)/media/media.actions";

export const metadata = {
  title: "Archives | CIE Admin",
  description: "Documents d'archive du club, réservés au bureau",
};

export default async function ArchiverPage() {
  // Module désactivé depuis la page Administration, ou poste sans la permission `page:archiver` : introuvable.
  if (await isModuleDisabled("archiver")) notFound();
  if (!hasPermission(await getCurrentAccess(), "page:archiver")) notFound();

  const { rows, unavailable } = await loadMedia("DOCUMENT");

  return <ArchiveBoard rows={rows} unavailable={unavailable} updateAction={updateMediaAction} deleteAction={deleteMediaAction} />;
}
