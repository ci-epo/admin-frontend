import AuthHeader from "@/components/sections/auth/AuthHeader";
import LoginForm from "@/components/sections/auth/LoginForm";
import { loginAction } from "@/app/(auth)/login/login.actions";

export const metadata = {
  title: "Connexion | CIE Admin",
  description: "Connexion à l'administration du club",
};

export default function LoginPage() {
  return (
    <>
      <AuthHeader />
      <div className="container position-relative z-1 py-10">
        <LoginForm action={loginAction} />
      </div>
    </>
  );
}
