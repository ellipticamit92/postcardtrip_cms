"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useFieldArray, useForm } from "react-hook-form";
import { Itinerary, Options } from "@/types/type";
import { useItineraries } from "@/hooks/use-itineraries";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { FormSelect } from "@/components/atoms/FormSelect";
import { FormMultiSelect } from "@/components/atoms/FormMultiSelect";
import { FormRichText } from "@/components/atoms/FormRichText";
import { FormInput } from "@/components/atoms/FormInput";
import { Loader2 } from "lucide-react";

const daySchema = z.object({
  day: z.number().min(1, "Day number required"),
  title: z.string().min(1, "Title required"),
  details: z.string().min(1, "Details required"),
  highlights: z.array(z.number()).optional(),
  places: z.array(z.number()).optional(),
});

const itinerariesSchema = z.object({
  packageId: z.string().min(1, "Please the package"),
  days: z.array(daySchema).min(1, "At least one day required"),
});

type ItinerariesFormData = z.infer<typeof itinerariesSchema>;

interface ItinerariesFormProps {
  packages: { label: string; value: string }[];
  initialDays?: Array<{
    day: number;
    title: string;
    details: string;
    highlights: number[];
    places: number[];
  }>;
  initialData?: Itinerary[];
  cityOptions?: Options;
  highlightOptions: Options;
  itineraryId?: number;
}

export default function ItinerariesForm({
  itineraryId,
  initialData,
  packages,
  cityOptions,
  highlightOptions,
}: ItinerariesFormProps) {
  const { loading, createItinerary, updateItinerary } = useItineraries();
  const form = useForm<ItinerariesFormData>({
    resolver: zodResolver(itinerariesSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "days",
  });

  const onSubmit = async (data: any) => {
    try {
      const isEditMode = Boolean(itineraryId);

      const submitData = {
        packageId: data.packageId,
        days: data.days,
      };
      if (isEditMode && itineraryId) {
        //await updatePackage(PackageId, submitData);
      } else {
        await createItinerary(submitData);
      }

      if (!isEditMode) {
        reset();
      }
    } catch (err: any) {
      console.error("Error submitting Package", err);
      toast.error(err.message || "Error submitting Package");
    }
  };

  // Demo of using your entire atomic inputs for composition
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div className="grid grid-cols-3 gap-4">
          <FormSelect
            label="Package"
            name="packageId"
            control={control}
            options={packages}
            placeholder="Select destination"
          />
        </div>

        <div className="space-y-3 bg-white">
          {fields.map((field, i) => (
            <div
              key={field.id}
              className="grid grid-cols-3 gap-4 mb-4 p-3 py-4 border-dashed border-3 relative"
            >
              <FormInput
                control={control}
                name={`days.${i}.title`}
                label={`Day ${i + 1} Title`}
              />
              <FormMultiSelect
                name={`days.${i}.places`}
                control={control}
                label="Select Ciities"
                options={cityOptions || []}
              />
              <FormMultiSelect
                name={`days.${i}.highlights`}
                control={control}
                label="Select Highlihts"
                options={highlightOptions || []}
              />
              {fields.length > 1 && (
                <div className="absolute right-5 top-4">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    disabled={isSubmitting || loading}
                    onClick={() => remove(i)}
                    className="ml-2"
                  >
                    <span aria-hidden>✕</span>
                  </Button>
                </div>
              )}
              <div className="col-span-3">
                <FormRichText
                  label={`Day ${i + 1} Details`}
                  name={`days.${i}.details`}
                  control={control}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end my-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              append({
                day: fields.length > 0 ? fields[fields.length - 1].day + 1 : 1,
                title: "",
                details: "",
              })
            }
            disabled={isSubmitting || loading}
          >
            + Add Another Day
          </Button>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2" />}
            {initialData ? "Update" : "Add"} Itineraries
          </Button>
        </div>
      </form>
    </Form>
  );
}
