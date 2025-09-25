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
import { FormSelect } from "@/components/atoms/FormSelect";
import { FormTextarea } from "@/components/atoms/FormTextarea";
import ImageUploader from "@/components/atoms/ImageUploader";
import { Options } from "@/types/type";
import FormSection from "@/components/molecules/FormSection";
import FormSwitchableEditor from "@/components/molecules/FormSwitchableEditor";

const schema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().optional(),
  overview: z.string().optional(),
  day: z.number().min(1, "Please select day"),
  night: z.number().min(1, "Please select night"),
  popular: z.boolean().optional(),
  featured: z.boolean().optional(),
  status: z.boolean().optional(),
  heroTitle: z.string().optional(),
  rating: z.number().min(1, "Please a rating"),
  text: z.string().optional(),
  tours: z.array(z.number()).optional(),
  cities: z.array(z.number()).optional(),
  highlights: z.array(z.number()).optional(),
  inclusions: z.array(z.number()).optional(),
  exclusions: z.array(z.number()).optional(),
  isRichText: z.boolean().optional(),
  threePrice: z.number().min(1, "Please enter 3 star price"),
  fourPrice: z.number().min(1, "Please enter 4 star price"),
  fivePrice: z.number().min(1, "Please enter 5 star price"),
  destinationId: z.number().min(1, "Please atleast one number"),
  category: z.string().optional(),
});

export type PackageFormDataType = z.infer<typeof schema>;

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
  initialData?: PackageFormDataType;
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

  const form = useForm<PackageFormDataType>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      name: "",
      destinationId: Number(destinations?.[0]?.value) ?? 0,
      imageUrl: "",
      featured: false,
      popular: false,
      status: false,
      isRichText: false,
      overview: "",
      heroTitle: "",
      text: "",
      category: "",
      tours: [],
      cities: [],
      highlights: [],
      inclusions: [],
      exclusions: [],
    },
  });

  const { control, reset } = form;

  const getCategory = (selectedTours: number[]) => {
    if (!toursOptions || toursOptions.length === 0) return "";
    const selectedLabels = toursOptions
      ?.filter((opt) => selectedTours?.includes(Number(opt.value)))
      ?.map((opt) => opt.label)
      ?.join(", ");
    return selectedLabels;
  };

  const onSubmit = async (data: PackageFormDataType) => {
    try {
      const isEditMode = Boolean(PackageId);

      const submitData = {
        name: data.name.trim(),
        day: data.day,
        night: data.night,
        destinationId: Number(data.destinationId) ?? 1,
        imageUrl: data.imageUrl ?? "not-url",
        threePrice: data.threePrice ?? 0,
        fourPrice: data.fourPrice ?? 0,
        fivePrice: data.fivePrice ?? 0,
        popular: !!data.popular,
        rating: data.rating,
        overview: data.overview?.trim() || "",
        featured: !!data.featured,
        status: !!data.status,
        isRichText: !!data.isRichText,
        heroTitle: data.heroTitle?.trim() || "",
        text: data.text?.trim() || "",
        tours: data.tours || [],
        cities: data.cities || [],
        highlights: data.highlights || [],
        inclusions: data.inclusions || [],
        exclusions: data.exclusions || [],
        category: data?.tours ? getCategory(data.tours) : "",
      };

      if (isEditMode && PackageId) {
        await updatePackage(PackageId, submitData);
      } else {
        await createPackage(submitData);
      }

      if (!isEditMode) {
        reset();
      }
    } catch (err: any) {
      console.error("Error submitting Package", err);
      toast.error(err.message || "Error submitting Package");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-12">
        {/* Basic Information */}
        <FormSection title="Basic Information & 💰 Pricing" icon="📍">
          <FormInput name="name" control={control} label="Package Name" />
          <FormSelect
            label="Destination"
            name="destinationId"
            control={control}
            options={destinations}
            placeholder="Select destination"
            isNumber
          />
          <FormInput name="heroTitle" control={control} label="Hero Title" />
          <div className="flex gap-2 w-full">
            <div className="flex-1">
              <FormInput
                name="rating"
                type="number"
                control={control}
                label="Rating (0-5)"
              />
            </div>
            <div className="flex-1">
              <FormInput
                name="threePrice"
                control={control}
                label="3★ Price"
                type="number"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <div className="flex-1">
              <FormInput
                name="fourPrice"
                control={control}
                label="4★ Price"
                type="number"
              />
            </div>
            <div className="flex-1">
              <FormInput
                name="fivePrice"
                control={control}
                label="5★ Price"
                type="number"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <div className="flex-1">
              <FormSelect
                label="Day"
                name="day"
                control={control}
                options={numberOptions(15)}
                placeholder="Day"
                isNumber
              />
            </div>
            <div className="flex-1">
              <FormSelect
                label="Night"
                name="night"
                control={control}
                options={numberOptions(16)}
                placeholder="Night"
                isNumber
              />
            </div>
          </div>
        </FormSection>
        <FormSection title="Highlights" icon="⭐">
          <div className="col-span-2">
            <FormTextarea name="text" control={control} label="Card Text" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <FormCheckbox name="popular" control={control} label="Popular" />
            <FormCheckbox name="featured" control={control} label="Featured" />
            <FormCheckbox name="status" control={control} label="Active" />
          </div>
        </FormSection>

        {/* Options */}
        <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            ⚙️ Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormMultiSelect
              name="tours"
              control={control}
              label="Tours"
              options={toursOptions || []}
            />
            <FormMultiSelect
              name="cities"
              control={control}
              label="Cities"
              options={cityOptions || []}
            />
            <FormMultiSelect
              name="highlights"
              control={control}
              label="Highlights"
              options={highlightOptions || []}
            />
            <FormMultiSelect
              name="inclusions"
              control={control}
              label="Inclusions"
              options={inclusionOptions || []}
            />
            <FormMultiSelect
              name="exclusions"
              control={control}
              label="Exclusions"
              options={exclusionOptions || []}
            />
          </div>
        </div>
        <FormSection title="Content & 🎨  Media" icon="🖋️">
          <div className="lg:col-span-2">
            <FormSwitchableEditor
              name="overview"
              isRichName="isRichText"
              control={control}
              label="Overview"
              placeholder="Write something about this destination..."
              height={360}
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

        {/* Submit */}
        <div className="flex justify-end bg-white p-4 shadow-md sticky bottom-0">
          <Button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-base font-medium"
          >
            {loading && <Loader2 className="animate-spin mr-2" />}
            {initialData ? "Update" : "Add"} Package
          </Button>
        </div>
      </form>
    </Form>
  );
}
