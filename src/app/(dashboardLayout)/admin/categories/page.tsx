"use client";

import { PageLoader } from "@/components/modules/shared/LoadingSpinner";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CategoryService } from "@/services/api.services";
import { Category } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters."),
});
type Values = z.infer<typeof schema>;

const CATEGORY_EMOJIS: Record<string, string> = {
  bengali: "🍛",
  burger: "🍔",
  pizza: "🍕",
  sushi: "🍣",
  biryani: "🍚",
  pasta: "🍝",
  salad: "🥗",
  desserts: "🍰",
  chicken: "🍗",
  seafood: "🦐",
};

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getAll,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
  });

  const { mutate: createCat } = useMutation({
    mutationFn: (data: Values) => CategoryService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created!");
      setDialogOpen(false);
      reset();
    },
    onError: (err: Error) => toast.error(err.message),
    onSettled: () => setIsSubmitting(false),
  });

  const { mutate: updateCat } = useMutation({
    mutationFn: (data: Values) => CategoryService.update(editingCat!.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated.");
      setDialogOpen(false);
      setEditingCat(null);
      reset();
    },
    onError: (err: Error) => toast.error(err.message),
    onSettled: () => setIsSubmitting(false),
  });

  const { mutate: deleteCat } = useMutation({
    mutationFn: CategoryService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openAdd = () => {
    setEditingCat(null);
    reset({ name: "" });
    setDialogOpen(true);
  };
  const openEdit = (cat: Category) => {
    setEditingCat(cat);
    reset({ name: cat.name });
    setDialogOpen(true);
  };

  const onSubmit = (values: Values) => {
    setIsSubmitting(true);
    if (editingCat) updateCat(values);
    else createCat(values);
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {categories.length} categories on the platform
          </p>
        </div>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <Tag className="h-14 w-14 text-muted-foreground/30" />
          <p className="font-semibold">No categories yet</p>
          <Button onClick={openAdd} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add First Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl flex-shrink-0">
                {CATEGORY_EMOJIS[cat.slug] ?? "🍽️"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{cat.name}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  /{cat.slug}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cat._count?.meals ?? 0} meal
                  {(cat._count?.meals ?? 0) !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => openEdit(cat)}
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
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
                        Delete &quot;{cat.name}&quot;?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {(cat._count?.meals ?? 0) > 0
                          ? `This category has ${cat._count?.meals} meals. You must reassign all meals before deleting.`
                          : "This action cannot be undone."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={(cat._count?.meals ?? 0) > 0}
                        onClick={() => deleteCat(cat.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
          if (!o) {
            setEditingCat(null);
            reset();
          }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editingCat ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>
                Category Name <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. Bengali, Burger, Pizza…"
                className={cn(errors.name && "border-destructive")}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                The slug will be auto-generated from the name.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-1.5">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingCat ? "Save Changes" : "Create Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
