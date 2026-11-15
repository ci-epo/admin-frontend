import { notFound } from "next/navigation";
import { isModuleDisabled } from "@/lib/api/administration.endpoints";
import { getCurrentAccess, hasPermission } from "@/lib/auth/current-access";
import { loadMedia } from "@/lib/api/media.loader";
import MediaGallery from "@/components/sections/admin/media/MediaGallery";
import { deleteMediaAction, updateMediaAction } from "@/app/(admin)/media/media.actions";

export const metadata = {
  title: "Vidéos | CIE Admin",
  description: "Vidéos affichées sur l'accueil du site",
};

export default async function VideosPage() {
  // Module désactivé depuis la page Administration, ou poste sans la permission `page:archiver` : introuvable.
  if (await isModuleDisabled("videos")) notFound();
  if (!hasPermission(await getCurrentAccess(), "page:archiver")) notFound();

  const { rows, unavailable } = await loadMedia("VIDEO");

  return <MediaGallery kind="VIDEO" rows={rows} unavailable={unavailable} updateAction={updateMediaAction} deleteAction={deleteMediaAction} />;
}
