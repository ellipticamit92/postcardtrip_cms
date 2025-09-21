"use client";

import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { COUNTRIES } from "@/consttants/constant";
import { useDestinations } from "@/hooks/use-destinations";
import { toast } from "sonner";
import { FormCheckbox } from "@/components/atoms/FormCheckbox";
import { FormTextarea } from "@/components/atoms/FormTextarea";
import ImageUploader from "@/components/atoms/ImageUploader";
import { FormSelect } from "@/components/atoms/FormSelect";
import FormSection from "@/components/molecules/FormSection";
import FormSwitchableEditor from "@/components/molecules/FormSwitchableEditor";

const schema = z.object({
  name: z.string().min(1),
  heading: z.string().min(1),
  country: z.string().min(1),
  overview: z.string().min(1),
  imageUrl: z.string().optional(),
  trending: z.boolean().optional(),
  status: z.boolean().optional(),
  featured: z.boolean().optional(),
  isRichText: z.boolean().optional(),
  text: z.string().optional(),
  heroTitle: z.string().optional(),
  rating: z.number().min(1, "Please a rating"),
  basePrice: z.number().min(1, "Please enter base price"),
  originalPrice: z.number().min(1, "Please enter original price"),
});

export type DestinationFormDataType = z.infer<typeof schema>;

export function DestinationForm({
  initialData,
  destinationId,
}: {
  initialData?: DestinationFormDataType;
  destinationId?: number;
}) {
  const { createDestination, updateDestination, loading } = useDestinations({
    autoFetch: false,
  });

  const form = useForm<DestinationFormDataType>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      name: "",
      heading: "",
      country: "",
      overview: "",
      imageUrl: "",
      trending: false,
      featured: false,
      isRichText: false,
      status: false,
      heroTitle: "",
      text: "",
    },
  });

  const { control, reset } = form;

  const onSubmit = async (data: DestinationFormDataType) => {
    try {
      const isEditMode = Boolean(destinationId);

      const submitData = {
        name: data.name.trim(),
        heading: data.heading.trim(),
        country: data.country.trim(),
        overview: data.overview?.trim() || undefined,
        imageUrl: data.imageUrl?.trim() || undefined,
        trending: data.trending || false,
        featured: data.featured || false,
        isRichText: data.isRichText || false,
        status: data.status || false,
        basePrice: data.basePrice,
        originalPrice: data.originalPrice,
        text: data.text?.trim() || undefined,
        heroTitle: data.heroTitle?.trim() || undefined,
        rating: data.rating,
      };

      if (isEditMode && destinationId) {
        await updateDestination(destinationId, submitData);
      } else {
        await createDestination(submitData);
      }

      if (!isEditMode) {
        //reset();
      }
    } catch (err: any) {
      console.error("Error submitting destination", err);
      toast.error(err.message || "Error submitting destination");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mb-12">
        {/* --- Basic Info Section --- */}
        <FormSection title="Basic Information" icon="📍">
          <FormInput name="name" control={control} label="Destination Name" />
          <FormInput name="heading" control={control} label="Heading" />
          <FormInput name="heroTitle" control={control} label="Hero Title" />
          <FormSelect
            name="country"
            control={control}
            label="Country"
            placeholder="Select a country"
            options={COUNTRIES}
          />
          <FormInput
            name="basePrice"
            type="number"
            control={control}
            label="Current Price"
          />
          <FormInput
            name="originalPrice"
            type="number"
            control={control}
            label="Original Price"
          />
        </FormSection>
        <FormSection title="Highlights" icon="⭐">
          <FormTextarea
            name="text"
            control={control}
            label="Destination Card Text"
          />
          <div>
            <FormInput
              type="number"
              name="rating"
              step="0.1" // <-- important to allow decimal numbers
              min={0}
              max={5}
              control={control}
              label="Rating (0-5)"
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter rating between 0 and 5
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <FormCheckbox
              name="trending"
              control={control}
              label="Trending Destination"
            />
            <FormCheckbox
              name="featured"
              control={control}
              label="Featured Destination"
            />
            <FormCheckbox name="status" control={control} label="Active" />
          </div>
        </FormSection>
        <FormSection title="Content & 🎨 Media" icon="🖋️">
          <div className="lg:col-span-2">
            <FormSwitchableEditor
              name="overview"
              isRichName="isRichText"
              control={control}
              label="Overview"
              placeholder="Write something about this destination..."
            />
          </div>
          <div>
            <Controller
              control={control}
              name="imageUrl"
              render={({ field }) => (
                <ImageUploader
                  value={field.value}
                  onChange={field.onChange}
                  label="Destination Image"
                />
              )}
            />
          </div>
        </FormSection>

        {/* --- Submit Button --- */}
        <div className="flex justify-end bg-white p-4 shadow-md sticky bottom-0">
          <Button
            variant="default"
            type="submit"
            disabled={loading}
            className="px-8 py-3 text-base font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            {loading && <Loader2 className="animate-spin mr-2" />}
            {initialData ? "Update Destination" : "Add Destination"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
