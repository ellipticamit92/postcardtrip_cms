"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTours } from "@/hooks/use-tours";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import { FormTextarea } from "@/components/atoms/FormTextarea";

const tourSchema = z.object({
  text: z.string().min(2, "Tour name is required"),
  description: z.string().min(5, "tour Description is too short"),
  icon: z.string().optional(),
  basePrice: z.string().optional(),
});

type CityFormValues = z.infer<typeof tourSchema>;

interface TourFormProps {
  initialData?: CityFormValues;
  tourId?: number;
}

export function TourForm({ initialData, tourId }: TourFormProps) {
  const { loading, createTour, updateTour } = useTours({
    autoFetch: false,
  });
  const form = useForm<CityFormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: initialData || {
      text: "",
      description: "",
      icon: "",
      basePrice: "",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: CityFormValues) => {
    try {
      const isEditMode = Boolean(tourId);

      const submitData = {
        text: data.text.trim(),
        description: data.description.trim(),
        icon: data.icon?.trim(),
        basePrice: data.basePrice ? parseInt(data.basePrice) : 0,
      };

      if (isEditMode && tourId) {
        await updateTour(tourId, submitData);
      } else {
        await createTour(submitData);
      }

      if (!isEditMode) {
        // reset();
      }
    } catch (err: any) {
      console.error("Error submitting destination", err);
      toast.error(err.message || "Error submitting destination");
    }
  };

  return (
    <div className="w-full bg-white p-3">
      <h1 className="text-xl font-bold mb-5">Basic Information</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <FormInput
              label="Tour Name"
              name="text"
              placeholder="Enter tour name"
              control={control}
            />
            <FormInput
              label="Tour Base Price"
              name="basePrice"
              placeholder="Enter tour base price"
              control={control}
            />

            <FormInput name="icon" control={control} label="Tour Icon" />
            <div className="col-span-3">
              <FormTextarea
                label="Tour Description"
                name="description"
                placeholder="Describe the tour"
                control={control}
              />
            </div>
          </div>

          <Button type="submit" size="sm" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2" />}
            {initialData ? "Update" : "Add"} Tour
          </Button>
        </form>
      </Form>
    </div>
  );
}
