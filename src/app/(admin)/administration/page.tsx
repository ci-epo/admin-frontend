import { notFound } from "next/navigation";
import AdministrationHeader from "@/components/sections/admin/administration/AdministrationHeader";
import AdministrationTabs from "@/components/sections/admin/administration/AdministrationTabs";
import AdminSettingsForm from "@/components/sections/admin/administration/AdminSettingsForm";
import BackupPanel from "@/components/sections/admin/administration/BackupPanel";
import PermissionMatrixForm from "@/components/sections/admin/administration/PermissionMatrixForm";
import WebSettingsForm from "@/components/sections/admin/administration/WebSettingsForm";
import { MENU } from "@/components/sections/admin/navbar";
import EmptyState from "@/components/ui/empty-state/EmptyState";
import {
  loadAdministrationPanel,
  parseAdministrationTab,
  type AdministrationData,
} from "@/lib/api/administration.loader";
import { toggleableModules } from "@/lib/utils/admin-modules";
import { getCurrentAccess, hasPermission } from "@/lib/auth/current-access";
import { readAccessToken } from "@/lib/auth/session";
import {
  createBackupAction,
  deleteBackupAction,
  importBackupAction,
  restoreBackupAction,
  savePermissionSelectionAction,
  saveAdminSettings,
  saveWebSettings,
} from "@/app/(admin)/administration/administration.actions";

export const metadata = {
  title: "Administration | CIE Admin",
  description: "Réglages du site public et de l'administration, sauvegardes et restaurations de la base de données",
};

interface AdministrationPageProps {
  searchParams: Promise<{ onglet?: string | string[] }>;
}

export default async function AdministrationPage({ searchParams }: AdministrationPageProps) {
  const tab = parseAdministrationTab((await searchParams).onglet);

  // Poste sans la permission `page:administration` (ex. bureau sans délégation) : introuvable, comme un module désactivé.
  const access = await getCurrentAccess();
  if (!hasPermission(access, "page:administration")) notFound();

  const accessToken = await readAccessToken();
  const result = accessToken
    ? await loadAdministrationPanel(tab, accessToken)
    : { status: "error" as const, message: "Session expirée : reconnectez-vous." };

  return (
    <>
      <AdministrationHeader />
      <AdministrationTabs active={tab} />
      {result.status === "error" ? (
        <EmptyState
          className="position-relative z-1"
          icon="ri-error-warning-line"
          title="Impossible d'afficher cette rubrique"
          description={result.message}
        />
      ) : (
        <AdministrationPanel data={result.data} canEditPermissions={hasPermission(access, "manage:access")} />
      )}
    </>
  );
}

interface AdministrationPanelProps {
  data: AdministrationData;
  canEditPermissions: boolean;
}

function AdministrationPanel({ data, canEditPermissions }: AdministrationPanelProps) {
  if (data.tab === "site") return <WebSettingsForm settings={data.web} action={saveWebSettings} />;
  if (data.tab === "droits") {
    return (
      <PermissionMatrixForm matrix={data.matrix} canEdit={canEditPermissions} action={savePermissionSelectionAction} />
    );
  }
  if (data.tab === "admin") {
    return <AdminSettingsForm settings={data.admin} modules={toggleableModules(MENU)} action={saveAdminSettings} />;
  }
  return (
    <BackupPanel
      backups={data.backups}
      actions={{
        create: createBackupAction,
        import: importBackupAction,
        restore: restoreBackupAction,
        delete: deleteBackupAction,
      }}
    />
  );
}
