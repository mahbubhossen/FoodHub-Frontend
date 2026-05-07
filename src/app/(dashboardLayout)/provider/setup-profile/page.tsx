// ─── PROVIDER SETUP PROFILE ───────────────────────────────────────────────
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ChefHat } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProviderService } from "@/services/api.services";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const schema = z.object({
  restaurantName: z.string().min(2, "Restaurant name is required."),
  description: z.string().optional(),
  address: z.string().min(5, "Address is required."),
  phone: z.string().optional(),
  logoUrl: z.string().url("Must be a valid URL.").optional().or(z.literal("")),
});

type Values = z.infer<typeof schema>;

export default function SetupProfilePage() {
  const router = useRouter();
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
  });

  const { mutate: createProfile } = useMutation({
    mutationFn: (data: Values) => ProviderService.createProfile(data ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["provider-profile"] });
      toast.success("Restaurant profile created! Welcome aboard 🎉");
      router.push(ROUTES.PROVIDER_DASH);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="flex min-h-full items-center justify-center py-8">
      <Card className="w-full max-w-lg border-border/60 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ChefHat className="h-6 w-6" />
          </div>
          <CardTitle>Set Up Your Restaurant</CardTitle>
          <CardDescription>
            Complete your profile to start receiving orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((v) => createProfile(v))}
            className="space-y-4"
          >
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
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={2}
                placeholder="What makes your restaurant special?"
                {...register("description")}
              />
            </div>
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
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input placeholder="+1 (555) 000-0000" {...register("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label>Logo URL</Label>
              <Input
                placeholder="https://..."
                className={cn(errors.logoUrl && "border-destructive")}
                {...register("logoUrl")}
              />
              {errors.logoUrl && (
                <p className="text-xs text-destructive">
                  {errors.logoUrl.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create Restaurant Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
