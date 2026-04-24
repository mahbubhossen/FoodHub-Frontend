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
import { ROUTES } from "@/constants";
import { signIn, signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChefHat, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// ─── Login Form ────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "";
  const [showPassword, setShowPassword] = useState(false);

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

    const redirect = callbackUrl ?? ROUTES.MEALS;

    router.push(redirect);
    router.refresh();
  };

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
    role: z.enum(["CUSTOMER", "PROVIDER"], {
      message: "Please select a role.",
    }),
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CUSTOMER" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (values: RegisterValues) => {
    const { error } = await signUp.email({
   
      // better-auth passes additionalFields through
      ...(({ confirmPassword: _, ...rest }) => rest)(values),
    } );

    if (error) {
      toast.error(error.message ?? "Registration failed. Please try again.");
      return;
    }

    toast.success("Account created! Welcome to FoodHub 🎉");

    const redirect =
      values.role === "PROVIDER" ? ROUTES.PROVIDER_SETUP : ROUTES.MEALS;
    router.push(redirect);
    router.refresh();
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
          {/* Role selector */}
          <div className="space-y-1.5">
            <Label>I want to join as</Label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  {
                    value: "CUSTOMER",
                    emoji: "🧑‍🍳",
                    label: "Customer",
                    desc: "Order meals",
                  },
                  {
                    value: "PROVIDER",
                    emoji: "🍽️",
                    label: "Provider",
                    desc: "Sell meals",
                  },
                ] as const
              ).map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setValue("role", r.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all",
                    selectedRole === r.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <span className="text-xl">{r.emoji}</span>
                  <span className="text-sm font-semibold">{r.label}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {r.desc}
                  </span>
                </button>
              ))}
            </div>
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
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
