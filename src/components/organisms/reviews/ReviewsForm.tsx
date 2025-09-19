"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FormTextarea } from "@/components/atoms/FormTextarea";
import { FormSelect } from "@/components/atoms/FormSelect";
import MyForm from "../MyForm";
import { useReviews } from "@/hooks/use-reviews"; // ✅ You'll need to create this hook

// ✅ Validation schema
const schema = z.object({
  username: z.string().min(1, "Username is required"),
  places: z.string().min(1, "Places visited is required"),
  review: z.string().min(5, "Review must be at least 5 characters"),
  rating: z
    .number()
    .min(0, "Rating must be between 0-5")
    .max(5, "Rating must be between 0-5"),
  packageId: z.string().optional(),
  destinationId: z.string().optional(),
});

export type ReviewFormData = z.infer<typeof schema>;

export function ReviewForm({
  initialData,
  reviewId,
  destinations,
  packages,
}: {
  initialData?: ReviewFormData;
  reviewId?: string;
  destinations: { label: string; value: string }[];
  packages: { label: string; value: string }[];
}) {
  const { createReview, updateReview, loading } = useReviews({
    autoFetch: false,
  });

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      username: "",
      places: "",
      review: "",
      rating: 0,
      packageId: "",
      destinationId: "",
    },
  });

  const { control, reset } = form;

  const onSubmit = async (data: ReviewFormData) => {
    try {
      const isEditMode = Boolean(reviewId);

      const submitData = {
        username: data.username.trim(),
        places: data.places.trim(),
        review: data.review.trim(),
        rating: data.rating,
        packageId: Number(data.packageId) || undefined,
        destinationId: Number(data.destinationId) || undefined,
      };

      if (isEditMode && reviewId) {
        await updateReview(reviewId, submitData);
      } else {
        await createReview(submitData);
      }

      if (!isEditMode) {
        // reset();
      }
    } catch (err: any) {
      console.error("Error submitting review", err);
      toast.error(err.message || "Error submitting review");
    }
  };

  return (
    <MyForm title="Review Details">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mb-10"
        >
          <div className="grid grid-cols-3 gap-4">
            <FormInput name="username" control={control} label="Username" />
            <FormInput name="places" control={control} label="Places Visited" />
            <FormInput
              name="rating"
              type="number"
              control={control}
              label="Rating (0-5)"
            />
          </div>

          <FormTextarea
            name="review"
            control={control}
            label="Review"
            placeholder="Write your experience..."
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Select Reviewed Package"
              name="packageId"
              control={control}
              options={packages}
              placeholder="Select Reviewed package"
            />
            <FormSelect
              label="Select Reviewed Destiantion"
              name="destinationId"
              control={control}
              options={destinations}
              placeholder="Select Reviewed Destiantion"
            />
          </div>

          <Button variant="secondary" type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2" />}
            {initialData ? "Update" : "Add"} Review
          </Button>
        </form>
      </Form>
    </MyForm>
  );
}
