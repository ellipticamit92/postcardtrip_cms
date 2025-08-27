"use client";

import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import { Button } from "@/components/ui/button";
import { FormSelect } from "../atoms/FormSelect";
import { Loader2 } from "lucide-react";
import { COUNTRIES } from "@/consttants/constant";
import { FormRichText } from "../atoms/FormRichText";
import { useDestinations } from "@/hooks/use-destinations";
import { toast } from "sonner";
import ImageUploader from "../atoms/ImageUploader";
import { FormCheckbox } from "../atoms/FormCheckbox";
import { FormTextarea } from "../atoms/FormTextarea";

const schema = z.object({
  name: z.string().min(1),
  heading: z.string().min(1),
  country: z.string().min(1),
  overview: z.string().min(1),
  imageUrl: z.string().optional(),
  trending: z.boolean().optional(),
  basePrice: z.string().optional(),
  description: z.string().optional(),
  text: z.string().optional(),
  heroTitle: z.string().optional(),
  originalPrice: z.string().optional(),
  rating: z.string().optional(),
});

export type DestinationFormData = z.infer<typeof schema>;

export function DestinationForm({
  initialData,
  destinationId,
}: {
  initialData?: DestinationFormData;
  destinationId?: number;
}) {
  const { createDestination, updateDestination, loading } = useDestinations({
    autoFetch: false,
  });

  const form = useForm<DestinationFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      name: "",
      heading: "",
      country: "",
      overview: "",
      imageUrl: "",
      basePrice: "0",
      trending: false,
      heroTitle: "",
      originalPrice: "0",
      description: "",
      text: "",
      rating: "1.0",
    },
  });

  const { control, reset } = form;

  const onSubmit = async (data: DestinationFormData) => {
    try {
      const isEditMode = Boolean(destinationId);

      const submitData = {
        name: data.name.trim(),
        heading: data.heading.trim(),
        country: data.country.trim(),
        overview: data.overview?.trim() || undefined,
        imageUrl: data.imageUrl?.trim() || undefined,
        trending: data.trending || false,
        basePrice: data.basePrice ? Number(data.basePrice) : 0,
        originalPrice: data.originalPrice ? Number(data.originalPrice) : 0,
        description: data.description?.trim() || undefined,
        text: data.text?.trim() || undefined,
        heroTitle: data.heroTitle?.trim() || undefined,
        rating: data.rating ?? "",
      };

      if (isEditMode && destinationId) {
        await updateDestination(destinationId, submitData);
      } else {
        await createDestination(submitData);
      }

      if (!isEditMode) {
        //  reset();
      }
    } catch (err: any) {
      console.error("Error submitting destination", err);
      toast.error(err.message || "Error submitting destination");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-10">
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-2">
            <FormInput name="name" control={control} label="Name" />
          </div>
          <div className="col-span-2">
            <FormInput name="heading" control={control} label="Heading" />
          </div>
          <div className="col-span-2">
            <FormInput
              name="heroTitle"
              control={control}
              label="Destination Hero Title"
            />
          </div>

          <FormInput
            name="basePrice"
            type="number"
            control={control}
            label="Price"
          />
          <FormInput
            name="originalPrice"
            type="number"
            control={control}
            label="Original Price"
          />
          <FormInput name="rating" control={control} label="Rating" />
          <FormSelect
            name="country"
            control={control}
            label="Select Country"
            placeholder="Choose your country"
            options={COUNTRIES}
          />
          <FormInput
            disabled
            name="imageUrl"
            control={control}
            label="Image URL"
          />
          <FormCheckbox name="trending" control={control} label="Trending " />
          <div className="col-span-3">
            <FormTextarea
              name="description"
              control={control}
              label="Description"
            />
          </div>
          <div className="col-span-3">
            <FormTextarea
              name="text"
              control={control}
              label="Destination Card Text"
            />
          </div>

          <div className="col-span-4">
            <FormRichText
              label="Overview"
              name="overview"
              placeholder="Describe the destination"
              control={control}
              height={260}
            />
          </div>
          <div className="col-span-2">
            <Controller
              control={control}
              name="imageUrl"
              render={({ field }) => (
                <ImageUploader
                  value={field.value}
                  onChange={field.onChange}
                  label="Upload Destination Image"
                />
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2" />}
          {initialData ? "Update" : "Add"} Destination
        </Button>
      </form>
    </Form>
  );
}
