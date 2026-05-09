"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants";
import { signIn, signUp, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, ChefHat, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// ─── Google Icon SVG ────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className="h-4 w-4"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

// ─── Login Form ────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "localhost:3000/meals";
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    const { error, data } = await signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(
        error.message ?? "Login failed. Please check your credentials.",
      );
      return;
    }

    toast.success("Welcome back! 👋");

    const role = data?.user?.role ?? "CUSTOMER";
    const redirect = callbackUrl
      ? callbackUrl
      : role === "ADMIN"
        ? ROUTES.ADMIN_DASH
        : role === "PROVIDER"
          ? ROUTES.PROVIDER_DASH
          : ROUTES.MEALS;

    router.push(redirect);
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: callbackUrl || ROUTES.MEALS,
      });
      // Note: better-auth handles the redirect automatically after OAuth
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const { data: session } = useSession();

  console.log("SESSION:", session);

  return (
    <Card className="w-full max-w-md border-border/60 shadow-xl shadow-black/5">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <ChefHat className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your FoodHub account</CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={cn(errors.email && "border-destructive")}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className={cn("pr-10", errors.password && "border-destructive")}
                {...register("password")}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="relative mb-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 gap-2 mb-4"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.REGISTER}
            className="font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Register Form ─────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters.").max(60),
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ── Role is managed with plain useState so the selected state is
  //    always reliable and is passed explicitly to better-auth ──────────────
  const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "PROVIDER">(
    "CUSTOMER",
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterValues) => {
    const { error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      // better-auth additional fields — role and status
      role: selectedRole,
      status: "ACTIVE",
    });

    if (error) {
      toast.error(error.message ?? "Registration failed. Please try again.");
      return;
    }

    toast.success("Account created! Welcome to FoodHub 🎉");

    // Providers must complete their restaurant profile before doing anything else
    const redirect =
      selectedRole === "PROVIDER" ? ROUTES.PROVIDER_SETUP : ROUTES.MEALS;
    router.push(redirect);
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      // Google OAuth doesn't carry a role — the user lands on MEALS by default.
      // If you need role selection for Google users, handle it post-OAuth.
      await signIn.social({
        provider: "google",
        callbackURL: ROUTES.MEALS,
      });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-border/60 shadow-xl shadow-black/5">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <ChefHat className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl">Create account</CardTitle>
        <CardDescription>Join FoodHub today — it&apos;s free</CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* ── Role selector ─────────────────────────────────────────────
              Controlled via useState (selectedRole) — completely independent
              from react-hook-form so the visual state is always correct.   */}
          <div className="space-y-1.5">
            <Label>I want to join as</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  value: "CUSTOMER" as const,
                  emoji: "🧑‍🍳",
                  label: "Customer",
                  desc: "Order meals",
                },
                {
                  value: "PROVIDER" as const,
                  emoji: "🍽️",
                  label: "Provider",
                  desc: "Sell meals",
                },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setSelectedRole(r.value)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all",
                    selectedRole === r.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  {/* ✅ Check icon (only when selected) */}
                  {selectedRole === r.value && (
                    <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-green-500" />
                  )}

                  <span className="text-xl">{r.emoji}</span>
                  <span className="text-sm font-semibold">{r.label}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {r.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Provider info hint */}
            {selectedRole === "PROVIDER" && (
              <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 mt-1">
                After registration you&apos;ll be taken to set up your
                restaurant profile before accessing your dashboard.
              </p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-name">Full Name</Label>
            <Input
              id="reg-name"
              placeholder="John Doe"
              autoComplete="name"
              className={cn(errors.name && "border-destructive")}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={cn(errors.email && "border-destructive")}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-password">Password</Label>
            <div className="relative">
              <Input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                autoComplete="new-password"
                className={cn("pr-10", errors.password && "border-destructive")}
                {...register("password")}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-confirm">Confirm Password</Label>
            <div className="relative">
              <Input
                id="reg-confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat password"
                autoComplete="new-password"
                className={cn(
                  "pr-10",
                  errors.confirmPassword && "border-destructive",
                )}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                account…
              </>
            ) : (
              "Create Account"
            )}
          </Button>
          <div className="relative mb-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>

          {/* Google Sign Up */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 gap-2 mb-4"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
