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

const schema = z.object({
  name: z.string().min(1),
  heading: z.string().min(1),
  country: z.string().min(1),
  overview: z.string().min(1),
  imageUrl: z.string().optional(),
  trending: z.boolean().optional(),
  basePrice: z.string().optional(),
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
      };

      console.log("Submitting destination data:", submitData);

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
        <div className="grid grid-cols-5 gap-4">
          <FormInput name="name" control={control} label="Destination Name" />
          <FormInput
            name="heading"
            control={control}
            label="Destination heading"
          />
          <FormInput
            name="basePrice"
            type="number"
            control={control}
            label="Destination base Price"
          />

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

          <div className="col-span-4">
            <FormRichText
              label="Overview"
              name="overview"
              placeholder="Describe the destination"
              control={control}
              height={260}
            />
          </div>
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
          <FormCheckbox
            name="trending"
            control={control}
            label="Trending Destination"
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2" />}
          {initialData ? "Update" : "Add"} Destination
        </Button>
      </form>
    </Form>
  );
}
