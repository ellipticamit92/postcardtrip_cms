"use client";

import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import { Button } from "@/components/ui/button";
import { FormSelect } from "../atoms/FormSelect";
import { Loader2 } from "lucide-react";
import { FormRichText } from "../atoms/FormRichText";
import { toast } from "sonner";
import ImageUploader from "../atoms/ImageUploader";
import { usePackages } from "@/hooks/use-packages";
import { FormCheckbox } from "../atoms/FormCheckbox";
import { FormTextarea } from "../atoms/FormTextarea";
import { FormMultiSelect } from "../atoms/FormMultiSelect";
import { Options } from "@/types/type";

const schema = z.object({
  name: z.string().min(1),
  destinationId: z.string().min(1, "Please atleast one number"),
  imageUrl: z.string().optional(),
  description: z.string().min(5, "Package Description is too short"),
  overview: z.string().optional(),
  basePrice: z.string().optional(),
  originalPrice: z.string().optional(),
  day: z.string().min(1, "Please select day"),
  night: z.string().min(1, "Please select night"),
  popular: z.boolean().optional(),
  featured: z.boolean().optional(),
  heroTitle: z.string().optional(),
  rating: z.string().optional(),
  text: z.string().optional(),
  tours: z.array(z.number()).optional(),
});

export type PackageFormData = z.infer<typeof schema>;

export function PackageForm({
  destinations,
  initialData,
  PackageId,
  toursOptions,
}: {
  destinations: Options;
  initialData?: PackageFormData;
  PackageId?: number;
  toursOptions?: Options;
}) {
  const { createPackage, updatePackage, loading } = usePackages({
    autoFetch: false,
  });

  const form = useForm<PackageFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      name: "",
      destinationId: destinations?.[0]?.value || "0",
      imageUrl: "",
      description: "",
      day: "",
      night: "",
      basePrice: "",
      popular: false,
      rating: "1.0",
      featured: false,
      overview: "",
      originalPrice: "",
      heroTitle: "",
      tours: [],
    },
  });

  const { control, reset } = form;

  const onSubmit = async (data: PackageFormData) => {
    try {
      const isEditMode = Boolean(PackageId);

      const submitData = {
        name: data.name.trim(),
        day: parseInt(data.day),
        night: parseInt(data.night),
        destinationId: parseInt(data.destinationId ?? "1"),
        imageUrl: data.imageUrl ?? "not-url",
        basePrice: parseFloat(data.basePrice ?? "0"),
        description: data.description.trim(),
        popular: data.popular ?? false,
        rating: data.rating ?? "1.0",
        originalPrice: parseFloat(data.originalPrice ?? "0"),
        overview: data.overview?.trim() || "",
        featured: data.featured ?? false,
        heroTitle: data.heroTitle?.trim() || "",
        text: data.text?.trim() || "",
        tours: data.tours || [],
      };

      console.log("submitData", data);

      if (isEditMode && PackageId) {
        await updatePackage(PackageId, submitData);
      } else {
        await createPackage(submitData);
      }

      if (!isEditMode) {
        // reset();
      }
    } catch (err: any) {
      console.error("Error submitting Package", err);
      toast.error(err.message || "Error submitting Package");
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
            <FormInput name="heroTitle" control={control} label="Hero Title" />
          </div>

          <FormInput name="rating" control={control} label="Rating" />
          <FormSelect
            label="Destination"
            name="destinationId"
            control={control}
            options={destinations}
            placeholder="Select destination"
          />

          <FormInput name="day" control={control} label=" Day" />
          <FormInput name="night" control={control} label=" Night" />

          <FormInput name="basePrice" control={control} label="Base Price" />
          <FormInput
            name="originalPrice"
            control={control}
            label="Original Price"
          />
          <FormCheckbox
            name="popular"
            control={control}
            label="Package is Popular"
          />
          <FormCheckbox
            name="featured"
            control={control}
            label="Featured Package"
          />

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
              label="Package Card Text"
            />
          </div>

          <div className="col-span-4">
            <FormRichText
              label="Package Overview"
              name="overview"
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
                  label="Upload Package Image"
                />
              )}
            />
          </div>
          <div className="col-span-3">
            <FormMultiSelect
              name="tours"
              control={control}
              label="Select Tours"
              options={toursOptions || []}
            />
          </div>
          <div className="col-span-2">
            <FormInput
              disabled
              name="imageUrl"
              control={control}
              label="Image URL"
            />
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2" />}
          {initialData ? "Update" : "Add"} Package
        </Button>
      </form>
    </Form>
  );
}
