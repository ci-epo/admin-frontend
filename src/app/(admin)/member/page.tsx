import MemberTable from "@/components/sections/admin/membres/MemberTable";
import { MEMBERS } from "@/components/sections/admin/membres/mockData";

export const metadata = {
  title: "Membres | CIE Admin",
  description: "Gestion des membres, du bureau, des partenaires et des visiteurs",
};

export default function MembresPage() {
  return <MemberTable members={MEMBERS} />;
}
