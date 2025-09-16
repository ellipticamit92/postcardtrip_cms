"use client";

import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePackages } from "@/hooks/use-packages";
import { numberOptions } from "@/lib/helper";
import { FormCheckbox } from "@/components/atoms/FormCheckbox";
import { FormMultiSelect } from "@/components/atoms/FormMultiSelect";
import { FormRichText } from "@/components/atoms/FormRichText";
import { FormSelect } from "@/components/atoms/FormSelect";
import { FormTextarea } from "@/components/atoms/FormTextarea";
import ImageUploader from "@/components/atoms/ImageUploader";
import { Options } from "@/types/type";

const schema = z.object({
  name: z.string().min(1),
  destinationId: z.string().min(1, "Please atleast one number"),
  imageUrl: z.string().optional(),
  description: z.string().min(5, "Package Description is too short"),
  overview: z.string().optional(),
  day: z.number().min(1, "Please select day"),
  night: z.number().min(1, "Please select night"),
  popular: z.boolean().optional(),
  featured: z.boolean().optional(),
  heroTitle: z.string().optional(),
  rating: z.string().optional(),
  text: z.string().optional(),
  tours: z.array(z.number()).optional(),
  cities: z.array(z.number()).optional(),
  highlights: z.array(z.number()).optional(),
  inclusions: z.array(z.number()).optional(),
  exclusions: z.array(z.number()).optional(),
  basePrice: z.number().min(1, "Please enter base price"),
  originalPrice: z.number().min(1, "Please enter original price"),
  threePrice: z.number().min(1, "Please enter 3 star price"),
  fourPrice: z.number().min(1, "Please enter 4 star price"),
  fivePrice: z.number().min(1, "Please enter 5 star price"),
});

export type PackageFormData = z.infer<typeof schema>;

export function PackageForm({
  destinations,
  initialData,
  PackageId,
  toursOptions,
  cityOptions,
  highlightOptions,
  inclusionOptions,
  exclusionOptions,
}: {
  destinations: Options;
  initialData?: PackageFormData;
  PackageId?: number;
  toursOptions?: Options;
  cityOptions?: Options;
  highlightOptions: Options;
  inclusionOptions: Options;
  exclusionOptions: Options;
}) {
  const { createPackage, updatePackage, loading } = usePackages({
    autoFetch: false,
  });

  const form = useForm<PackageFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      name: "",
      destinationId: String(destinations?.[0]?.value) || "0",
      imageUrl: "",
      description: "",
      rating: "1.0",
      featured: false,
      popular: false,
      overview: "",
      heroTitle: "",
      text: "",
      tours: [],
      cities: [],
      highlights: [],
      inclusions: [],
      exclusions: [],
    },
  });

  const { control, reset } = form;

  const onSubmit = async (data: PackageFormData) => {
    try {
      const isEditMode = Boolean(PackageId);

      const submitData = {
        name: data.name.trim(),
        day: data.day,
        night: data.night,
        destinationId: parseInt(data.destinationId ?? "1"),
        imageUrl: data.imageUrl ?? "not-url",
        basePrice: data.basePrice ?? 0,
        originalPrice: data.originalPrice ?? 0,
        threePrice: data.threePrice ?? 0,
        fourPrice: data.fourPrice ?? 0,
        fivePrice: data.fivePrice ?? 0,
        description: data.description.trim(),
        popular: data.popular ?? false,
        rating: data.rating ?? "1.0",
        overview: data.overview?.trim() || "",
        featured: data.featured ?? false,
        heroTitle: data.heroTitle?.trim() || "",
        text: data.text?.trim() || "",
        tours: data.tours || [],
        cities: data.cities || [],
        highlights: data.highlights || [],
        inclusions: data.inclusions || [],
        exclusions: data.exclusions || [],
      };

      if (isEditMode && PackageId) {
        await updatePackage(PackageId, submitData);
      } else {
        await createPackage(submitData);
      }

      if (!isEditMode) {
        //reset();
      }
    } catch (err: any) {
      console.error("Error submitting Package", err);
      toast.error(err.message || "Error submitting Package");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-10">
        <div className="grid grid-cols-10 gap-4">
          <div className="col-span-3">
            <FormInput name="name" control={control} label="Name" />
          </div>

          <div className="col-span-2">
            <FormSelect
              label="Destination"
              name="destinationId"
              control={control}
              options={destinations}
              placeholder="Select destination"
            />
          </div>
          <FormSelect
            label="Day"
            name="day"
            control={control}
            options={numberOptions(15)}
            placeholder="Select Day"
            isNumber
          />
          <FormSelect
            label="Night"
            name="night"
            control={control}
            options={numberOptions(16)}
            placeholder="Select Night"
            isNumber
          />

          <FormInput name="rating" control={control} label="Rating" />
          <FormInput
            name="basePrice"
            control={control}
            label="Base Price"
            type="number"
            placeholder="Enter Price"
          />
          <FormInput
            name="originalPrice"
            control={control}
            label="Original Price"
            type="number"
            placeholder="Enter Price"
          />
          <div className="col-span-2">
            <FormInput
              name="threePrice"
              control={control}
              label="3 Star Price"
              type="number"
              placeholder="Enter Price"
            />
          </div>
          <div className="col-span-2">
            <FormInput
              name="fourPrice"
              control={control}
              label="4 Star Price"
              type="number"
              placeholder="Enter Price"
            />
          </div>
          <div className="col-span-2">
            <FormInput
              name="fivePrice"
              control={control}
              label="5 Star Price"
              type="number"
              placeholder="Enter Price"
            />
          </div>
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
          <div className="col-span-2">
            <FormInput
              disabled
              name="imageUrl"
              control={control}
              label="Image URL"
            />
          </div>
          <div className="col-span-2">
            <FormMultiSelect
              name="tours"
              control={control}
              label="Select Tours"
              options={toursOptions || []}
            />
          </div>
          <div className="col-span-2">
            <FormMultiSelect
              name="cities"
              control={control}
              label="Select Ciities"
              options={cityOptions || []}
            />
          </div>
          <div className="col-span-2">
            <FormMultiSelect
              name="highlights"
              control={control}
              label="Select Highlihts"
              options={highlightOptions || []}
            />
          </div>
          <div className="col-span-2">
            <FormMultiSelect
              name="inclusions"
              control={control}
              label="Select Inclsions"
              options={inclusionOptions || []}
            />
          </div>
          <div className="col-span-2">
            <FormMultiSelect
              name="exclusions"
              control={control}
              label="Select Exclusions"
              options={exclusionOptions || []}
            />
          </div>

          <div className="col-span-5">
            <FormTextarea
              name="description"
              control={control}
              label="Description"
            />
          </div>
          <div className="col-span-5">
            <FormTextarea
              name="text"
              control={control}
              label="Package Card Text"
            />
          </div>
          <div className="col-span-7">
            <FormRichText
              label="Package Overview"
              name="overview"
              control={control}
              height={260}
            />
          </div>
          <div className="col-span-3">
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
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2" />}
          {initialData ? "Update" : "Add"} Package
        </Button>
      </form>
    </Form>
  );
}
