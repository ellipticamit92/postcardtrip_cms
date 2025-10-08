"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePackages } from "@/hooks/use-packages";
import { numberOptions } from "@/lib/helper";
import { FormSelect } from "@/components/atoms/FormSelect";
import { Options } from "@/types/type";
import FormSection from "@/components/molecules/FormSection";
import { PackageForm, PackageFormDataType } from "./PackageForm";
import { useState } from "react";
import { FormCheckbox } from "@/components/atoms/FormCheckbox";

const schema = z.object({
  day: z.number().min(1, "Please select day"),
  night: z.number().min(1, "Please select night"),
  destinationId: z.number().min(1, "Please atleast one number"),
  toursId: z.number().optional(),
  destination: z.string().optional(),
  tourType: z.string().optional(),
  imageChange: z.boolean().optional(),
});

export type PackageAIFormDataType = z.infer<typeof schema>;

export function PackageAIForm({
  destinations,
  initialData,
  packageId,
  toursOptions,
  cityOptions,
  highlightOptions,
  inclusionOptions,
  exclusionOptions,
}: {
  destinations: Options;
  toursOptions?: Options;
  initialData?: PackageFormDataType;
  packageId?: number;
  cityOptions?: Options;
  highlightOptions: Options;
  inclusionOptions: Options;
  exclusionOptions: Options;
}) {
  const { createUpdateAIPackage, loading } = usePackages({
    autoFetch: false,
  });
  const [aiData, setAIData] = useState<Partial<PackageFormDataType>>(
    initialData ?? ({} as Partial<PackageFormDataType>)
  );

  const form = useForm<PackageAIFormDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      destinationId:
        initialData?.destinationId ?? Number(destinations?.[0]?.value),
      day: initialData?.day,
      night: initialData?.night,
    },
  });

  const { control, setError } = form;

  const onSubmit = async (data: PackageAIFormDataType) => {
    try {
      const destinationName = destinations?.filter(
        (dest) => Number(dest.value) === data.destinationId
      );

      const toursName = toursOptions?.filter(
        (tour) => Number(tour.value) === data.toursId
      );

      const submitData = {
        day: data.day,
        night: data.night,
        destinationId: Number(data.destinationId) ?? 1,
        toursId: data.toursId ? Number(data.toursId) : undefined,
        destination: destinationName?.[0]?.label ?? "",
        tourType: toursName?.[0]?.label ?? "",
        isEdit: !!packageId,
        isImageChange: data.imageChange || false,
      };

      const aiResponseData = await createUpdateAIPackage(submitData);

      if (aiResponseData.success) {
        const ai = aiResponseData?.data ?? {};
        setAIData({
          ...(initialData ?? {}), // fall back to empty object if undefined
          name: ai.name ?? initialData?.name ?? "",
          overview: ai.overview ?? initialData?.overview ?? "",
          heroTitle: ai.heroTitle ?? initialData?.heroTitle ?? "",
          text: ai.text ?? initialData?.text ?? "",
          isRichText: false,

          ...(packageId
            ? {}
            : { imageUrl: ai.imageUrl ?? initialData?.imageUrl }),

          day: ai.day ?? initialData?.day,
          night: ai.night ?? initialData?.night,
          destinationId: ai.destinationId ?? initialData?.destinationId,
          tours: (ai as any)?.tours ?? (initialData as any)?.tours,
          imageUrl: ai?.imageUrl ?? initialData?.imageUrl,
          thumbnailUrl: ai?.thumbnailUrl ?? initialData?.thumbnailUrl,
        });
      } else {
        setError("destination", {
          type: "manual",
          message:
            `${aiResponseData.error}: ${aiResponseData?.details?.[0]?.message}` ||
            "Failed to generate destination",
        });
      }
    } catch (err: any) {
      console.error("Error submitting Package", err);
      toast.error(err.message || "Error submitting Package");
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mb-12"
        >
          {/* Basic Information */}
          <FormSection title="AI Basic Form" icon="📍">
            <FormSelect
              label="Destination"
              name="destinationId"
              control={control}
              options={destinations}
              placeholder="Select destination"
              isNumber
            />
            <div className="cols-span-2 flex gap-2">
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
                  options={numberOptions(15)}
                  placeholder="Night"
                  isNumber
                />
              </div>
              <FormCheckbox
                name="imageChange"
                control={control}
                label="Change Image"
              />
            </div>

            <FormSelect
              name="toursId"
              control={control}
              label="Tours"
              options={toursOptions || []}
              isNumber
            />

            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-base font-medium"
            >
              {loading && <Loader2 className="animate-spin mr-2" />}
              {packageId ? "Update" : "Generate"} AI Package
            </Button>
          </FormSection>
        </form>
      </Form>

      {aiData && Object.keys(aiData).length > 0 && (
        <PackageForm
          initialData={aiData}
          packageId={packageId}
          toursOptions={toursOptions}
          cityOptions={cityOptions}
          highlightOptions={highlightOptions}
          inclusionOptions={inclusionOptions}
          exclusionOptions={exclusionOptions}
          destinations={destinations}
        />
      )}
    </>
  );
}
