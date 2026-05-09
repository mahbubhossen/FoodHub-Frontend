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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { ProviderService } from "@/services/api.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChefHat, Loader2, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  restaurantName: z.string().min(2, "Restaurant name is required."),
  description: z.string().optional(),
  address: z.string().min(5, "Address is required."),
  phone: z.string().optional(),
  logoUrl: z.string().url("Must be a valid URL.").optional().or(z.literal("")),
  isOpen: z.boolean().default(true),
});

type Values = z.infer<typeof schema>;

export default function SetupProfilePage() {
  const router = useRouter();
  const qc = useQueryClient();

  // ── Try to load an existing profile ──────────────────────────────────────
  const { data: existingProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["provider-profile"],
    queryFn: ProviderService.getMyProfile,
    // Don't throw if the profile doesn't exist yet — treat 404 as null
    retry: false,
  });

  const isEditMode = !!existingProfile;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { isOpen: true },
  });

  const isOpen = watch("isOpen");

  // ── Pre-fill form when existing profile loads ─────────────────────────────
  useEffect(() => {
    if (existingProfile) {
      reset({
        restaurantName: existingProfile.restaurantName ?? "",
        description: existingProfile.description ?? "",
        address: existingProfile.address ?? "",
        phone: existingProfile.phone ?? "",
        logoUrl: existingProfile.logoUrl ?? "",
        isOpen: existingProfile.isOpen ?? true,
      });
    }
  }, [existingProfile, reset]);

  // ── Create mutation ───────────────────────────────────────────────────────
  const { mutate: createProfile, isPending: creating } = useMutation({
    mutationFn: (data: Values) => ProviderService.createProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["provider-profile"] });
      toast.success("Restaurant profile created! Welcome aboard 🎉");
      router.push(ROUTES.PROVIDER_DASH);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Update mutation ───────────────────────────────────────────────────────
  const { mutate: updateProfile, isPending: updating } = useMutation({
    mutationFn: (data: Values) => ProviderService.updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["provider-profile"] });
      qc.invalidateQueries({ queryKey: ["provider-dashboard"] });
      toast.success("Restaurant profile updated successfully!");
      router.push(ROUTES.PROVIDER_DASH);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const isPending = creating || updating;

  const onSubmit = (values: Values) => {
    if (isEditMode) {
      updateProfile(values);
    } else {
      createProfile(values);
    }
  };

  // ── Loading skeleton while checking for existing profile ──────────────────
  if (profileLoading) {
    return (
      <div className="flex min-h-full items-center justify-center py-8">
        <Card className="w-full max-w-lg border-border/60 shadow-lg">
          <CardContent className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
                <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-full items-center justify-center py-8">
      <Card className="w-full max-w-lg border-border/60 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {isEditMode ? (
              <Store className="h-6 w-6" />
            ) : (
              <ChefHat className="h-6 w-6" />
            )}
          </div>
          <CardTitle>
            {isEditMode ? "Update Your Restaurant" : "Set Up Your Restaurant"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Edit your restaurant details below"
              : "Complete your profile to start receiving orders"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Restaurant Name */}
            <div className="space-y-1.5">
              <Label>
                Restaurant Name <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. Mama's Kitchen"
                className={cn(errors.restaurantName && "border-destructive")}
                {...register("restaurantName")}
              />
              {errors.restaurantName && (
                <p className="text-xs text-destructive">
                  {errors.restaurantName.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={2}
                placeholder="What makes your restaurant special?"
                {...register("description")}
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label>
                Address <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="123 Food Street, City"
                className={cn(errors.address && "border-destructive")}
                {...register("address")}
              />
              {errors.address && (
                <p className="text-xs text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input placeholder="+1 (555) 000-0000" {...register("phone")} />
            </div>

            {/* Logo URL */}
            <div className="space-y-1.5">
              <Label>Logo URL</Label>
              <Input
                placeholder="https://example.com/logo.png"
                className={cn(errors.logoUrl && "border-destructive")}
                {...register("logoUrl")}
              />
              {errors.logoUrl && (
                <p className="text-xs text-destructive">
                  {errors.logoUrl.message}
                </p>
              )}
            </div>

            {/* isOpen toggle — only show in edit mode */}
            {isEditMode && (
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Restaurant Status</p>
                  <p className="text-xs text-muted-foreground">
                    {isOpen
                      ? "Visible and accepting orders"
                      : "Hidden from customers"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isOpen
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground",
                    )}
                  >
                    {isOpen ? "Open" : "Closed"}
                  </span>
                  <Switch
                    checked={isOpen}
                    onCheckedChange={(v) =>
                      setValue("isOpen", v, { shouldDirty: true })
                    }
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex flex-col gap-2 pt-1">
              <Button
                type="submit"
                className="w-full h-11"
                disabled={isPending || (isEditMode && !isDirty)}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Saving changes…" : "Creating…"}
                  </>
                ) : isEditMode ? (
                  "Save Changes"
                ) : (
                  "Create Restaurant Profile"
                )}
              </Button>

              {/* Cancel back to dashboard — only in edit mode */}
              {isEditMode && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => router.push(ROUTES.PROVIDER_DASH)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
