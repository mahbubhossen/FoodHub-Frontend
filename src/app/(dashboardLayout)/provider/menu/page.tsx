"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, UtensilsCrossed } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MealService, CategoryService } from "@/services/api.services";
import { Meal } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PageLoader } from "@/components/modules/shared/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const mealSchema = z.object({
  name: z.string().min(2, "Name is required."),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, "Price must be greater than 0."),
  categoryId: z.string().min(1, "Category is required."),
  imageUrl: z.string().url("Must be a valid URL.").optional().or(z.literal("")),
  dietaryTags: z.string().optional(),
  isAvailable: z.boolean().default(true),
});

type MealValues = z.infer<typeof mealSchema>;

function MealForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: {
  defaultValues?: Partial<MealValues>;
  onSubmit: (v: MealValues) => void;
  isSubmitting: boolean;
}) {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getAll,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MealValues>({
    resolver: zodResolver(mealSchema),
    defaultValues: { isAvailable: true, ...defaultValues },
  });

  return (
    <form
      id="meal-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label>
            Meal Name <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="e.g. Chicken Biryani"
            className={cn(errors.name && "border-destructive")}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label>Description</Label>
          <Textarea
            rows={2}
            placeholder="Short description…"
            {...register("description")}
          />
        </div>

        <div className="space-y-1.5">
          <Label>
            Price ($) <span className="text-destructive">*</span>
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className={cn(errors.price && "border-destructive")}
            {...register("price")}
          />
          {errors.price && (
            <p className="text-xs text-destructive">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Category <span className="text-destructive">*</span>
          </Label>
          <Select
            defaultValue={defaultValues?.categoryId}
            onValueChange={(v) => setValue("categoryId", v)}
          >
            <SelectTrigger
              className={cn(errors.categoryId && "border-destructive")}
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-xs text-destructive">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label>Image URL</Label>
          <Input
            placeholder="https://example.com/image.jpg"
            className={cn(errors.imageUrl && "border-destructive")}
            {...register("imageUrl")}
          />
          {errors.imageUrl && (
            <p className="text-xs text-destructive">
              {errors.imageUrl.message}
            </p>
          )}
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label>Dietary Tags</Label>
          <Input
            placeholder="e.g. halal,vegan,gluten-free (comma separated)"
            {...register("dietaryTags")}
          />
          <p className="text-xs text-muted-foreground">
            Separate tags with commas
          </p>
        </div>

        <div className="col-span-2 flex items-center gap-3 pt-1">
          <Switch
            id="available"
            defaultChecked={defaultValues?.isAvailable ?? true}
            onCheckedChange={(v) => setValue("isAvailable", v)}
          />
          <Label htmlFor="available" className="cursor-pointer">
            Available for ordering
          </Label>
        </div>
      </div>
    </form>
  );
}

export default function ProviderMenuPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["provider-meals"],
    queryFn: MealService.getProviderMeals,
  });

  const { mutate: createMeal } = useMutation({
    mutationFn: (data: Partial<Meal>) => MealService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["provider-meals"] });
      toast.success("Meal added to your menu!");
      setDialogOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
    onSettled: () => setIsSubmitting(false),
  });

  const { mutate: updateMeal } = useMutation({
    mutationFn: (data: Partial<Meal>) =>
      MealService.update(editingMeal!.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["provider-meals"] });
      toast.success("Meal updated.");
      setDialogOpen(false);
      setEditingMeal(null);
    },
    onError: (err: Error) => toast.error(err.message),
    onSettled: () => setIsSubmitting(false),
  });

  const { mutate: deleteMeal } = useMutation({
    mutationFn: MealService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["provider-meals"] });
      toast.success("Meal removed.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (values: any) => {
    setIsSubmitting(true);
    if (editingMeal) {
      updateMeal(values);
    } else {
      createMeal(values);
    }
  };

  const openAdd = () => {
    setEditingMeal(null);
    setDialogOpen(true);
  };
  const openEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setDialogOpen(true);
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Menu</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {meals.length} meal{meals.length !== 1 ? "s" : ""} on your menu
          </p>
        </div>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Meal
        </Button>
      </div>

      {meals.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <UtensilsCrossed className="h-14 w-14 text-muted-foreground/30" />
          <p className="font-semibold text-lg">No meals yet</p>
          <p className="text-muted-foreground text-sm">
            Add your first meal to start receiving orders
          </p>
          <Button onClick={openAdd} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add First Meal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="rounded-xl border border-border/60 bg-card overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-40 bg-muted">
                {meal.imageUrl ? (
                  <Image
                    src={meal.imageUrl}
                    alt={meal.name}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-950/30 dark:to-orange-900/10 text-4xl">
                    🍽️
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge
                    className={
                      meal.isAvailable
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0"
                        : "bg-muted text-muted-foreground border-0"
                    }
                  >
                    {meal.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-sm leading-tight line-clamp-1">
                    {meal.name}
                  </p>
                  <p className="text-sm font-bold text-primary flex-shrink-0">
                    {formatPrice(meal.price)}
                  </p>
                </div>
                {meal.category && (
                  <Badge variant="outline" className="text-[10px] mb-2">
                    {meal.category.name}
                  </Badge>
                )}
                {meal.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {meal.description}
                  </p>
                )}
                <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 h-8"
                    onClick={() => openEdit(meal)}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete &quot;{meal.name}&quot;?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove the meal from your menu.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => deleteMeal(meal.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setEditingMeal(null);
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMeal ? "Edit Meal" : "Add New Meal"}
            </DialogTitle>
          </DialogHeader>
          <MealForm
            key={editingMeal?.id ?? "new"}
            defaultValues={
              editingMeal
                ? {
                    name: editingMeal.name,
                    description: editingMeal.description ?? "",
                    price: editingMeal.price,
                    categoryId: editingMeal.categoryId,
                    imageUrl: editingMeal.imageUrl ?? "",
                    dietaryTags: editingMeal.dietaryTags ?? "",
                    isAvailable: editingMeal.isAvailable,
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="meal-form"
              disabled={isSubmitting}
              className="gap-1.5"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingMeal ? "Save Changes" : "Add Meal"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
