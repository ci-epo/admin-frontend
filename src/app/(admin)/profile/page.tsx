import { redirect } from "next/navigation";
import ForcePasswordNotice from "@/components/sections/admin/profile/ForcePasswordNotice";
import ProfileHeader from "@/components/sections/admin/profile/ProfileHeader";
import ProfileInfoForm from "@/components/sections/admin/profile/ProfileInfoForm";
import PasswordForm from "@/components/sections/admin/profile/PasswordForm";
import { changePasswordAction, updateProfileAction } from "@/app/(admin)/profile/profile.actions";
import { getCurrentAccess } from "@/lib/auth/current-access";

export const metadata = {
  title: "Mon profil | CIE Admin",
  description: "Modifier mes informations personnelles et mon mot de passe",
};

export default async function ProfilePage() {
  const access = await getCurrentAccess();
  if (!access) redirect("/login");

  return (
    <>
      <ProfileHeader access={access} />
      {access.mustChangePassword && <ForcePasswordNotice />}
      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <ProfileInfoForm
            action={updateProfileAction}
            initial={{
              firstName: access.firstName ?? "",
              name: access.name ?? "",
              phoneNumber: access.phoneNumber ?? "",
              email: access.email ?? "",
            }}
            canEdit={access.name !== null}
          />
        </div>
        <div className="col-12 col-xl-5">
          <PasswordForm action={changePasswordAction} />
        </div>
      </div>
    </>
  );
}
