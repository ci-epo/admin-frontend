import { notFound } from "next/navigation";
import { isModuleDisabled } from "@/lib/api/administration.endpoints";
import { loadProjectBoard } from "@/lib/api/project.loader";
import ProjectBoard from "@/components/sections/admin/project/ProjectBoard";
import TagsCard from "@/components/sections/admin/project/TagsCard";
import {
  createProjectAction,
  createTagAction,
  deleteProjectAction,
  deleteTagAction,
  updateProjectAction,
  updateTagAction,
} from "@/app/(admin)/project/project.actions";

export const metadata = {
  title: "Projets | CIE Admin",
  description: "Suivi des projets du club",
};

export default async function ProjectPage() {
  // Module désactivé depuis la page Administration : introuvable, même par son URL.
  if (await isModuleDisabled("project")) notFound();

  const board = await loadProjectBoard();

  return (
    <>
      <ProjectBoard
        rows={board.rows}
        tags={board.tags}
        createAction={createProjectAction}
        updateAction={updateProjectAction}
        deleteAction={deleteProjectAction}
      />
      <div className="mt-4">
        <TagsCard
          tags={board.tags}
          projects={board.rows}
          createAction={createTagAction}
          updateAction={updateTagAction}
          deleteAction={deleteTagAction}
        />
      </div>
    </>
  );
}
