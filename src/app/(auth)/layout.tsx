import type { ReactNode } from "react";
import AuthBackground from "@/components/sections/auth/AuthBackground";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthBackground />
      {children}
    </>
  );
}
