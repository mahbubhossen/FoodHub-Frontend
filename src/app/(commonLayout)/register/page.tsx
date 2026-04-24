import { RegisterForm } from "@/components/modules/authentication/authForms";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/30">
      <RegisterForm />
    </div>
  );
}
