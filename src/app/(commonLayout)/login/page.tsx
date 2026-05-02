import { LoginForm } from "@/components/modules/authentication/authForms";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/30">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
