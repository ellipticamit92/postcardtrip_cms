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

export type ReviewFormDataType = z.infer<typeof schema>;

export function ReviewForm({
  initialData,
  reviewId,
  destinations,
  packages,
}: {
  initialData?: ReviewFormDataType;
  reviewId?: string;
  destinations: { label: string; value: string }[];
  packages: { label: string; value: string }[];
}) {
  const { createReview, updateReview, loading } = useReviews({
    autoFetch: false,
  });

  const form = useForm<ReviewFormDataType>({
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

  const onSubmit = async (data: ReviewFormDataType) => {
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
        reset();
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
          className="space-y-6 rounded-xl border bg-card p-6 shadow-sm"
        >
          {/* Heading */}
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {initialData ? "Update Review" : "Add Review"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Share your travel experience and help others decide!
            </p>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              name="username"
              control={control}
              label="Username"
              placeholder="Your name"
            />
            <FormInput
              name="places"
              control={control}
              label="Places Visited"
              placeholder="e.g., Paris, London"
            />
            <FormInput
              name="rating"
              type="number"
              step="0.1"
              min={0}
              max={5}
              control={control}
              label="Rating (0-5)"
              placeholder="4.5"
            />
          </div>

          <FormTextarea
            name="review"
            control={control}
            label="Review"
            placeholder="Write your experience..."
          />

          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Reviewed Package"
              name="packageId"
              control={control}
              options={packages}
              placeholder="Select package"
            />
            <FormSelect
              label="Reviewed Destination"
              name="destinationId"
              control={control}
              options={destinations}
              placeholder="Select destination"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="default"
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update Review" : "Submit Review"}
            </Button>
          </div>
        </form>
      </Form>
    </MyForm>
  );
}
