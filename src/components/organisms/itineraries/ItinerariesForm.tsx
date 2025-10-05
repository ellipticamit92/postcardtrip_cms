"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useFieldArray, useForm } from "react-hook-form";
import { Options } from "@/types/type";
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
  subTitle: z.string().optional(),
  details: z.string().min(1, "Details required"),
  highlights: z.array(z.string()).optional(),
  cities: z.array(z.string()).optional(),
});

export type DaySchemaData = z.infer<typeof daySchema>;

const itinerariesSchema = z.object({
  packageId: z.number().min(1, "Day number required"),
  days: z.array(daySchema).min(1, "At least one day required"),
  title: z.string().min(1, "Title required"),
  highlights: z.array(z.number()).optional(),
});

export type ItinerariesFormData = z.infer<typeof itinerariesSchema>;

interface ItinerariesFormProps {
  packages: Options;
  cityOptions?: Options;
  highlightOptions: Options;
  hiValueOptions: Options;
  packageId?: number;
  initialData?: ItinerariesFormData;
  itineraryId?: number;
}

export default function ItinerariesForm({
  packages,
  cityOptions,
  highlightOptions,
  packageId,
  hiValueOptions,
  initialData,
  itineraryId,
}: ItinerariesFormProps) {
  const { loading, createItinerary, updateItinerary } = useItineraries();
  const form = useForm<ItinerariesFormData>({
    resolver: zodResolver(itinerariesSchema),
    defaultValues: initialData ?? {
      title: "",
    },
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
        title: data.title,
        highlights: data.highlights,
        days: data.days,
      };

      console.log("DEBUG submitData = ", submitData);
      if (isEditMode && itineraryId) {
        await updateItinerary(itineraryId, submitData);
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
          <FormInput control={control} name="title" label="Itinerary Name" />
          <FormSelect
            label="Package"
            name="packageId"
            control={control}
            options={packages}
            placeholder="Select destination"
            isNumber
          />
          <FormMultiSelect
            name="highlights"
            control={control}
            label="Select Itinerary Highlihts"
            options={highlightOptions || []}
          />
        </div>

        <div className="space-y-3 bg-white">
          {fields.map((field, i) => (
            <div key={field.id}>
              <h1 className="font-bold mb-1">Day {i + 1}: Data</h1>
              <div className="grid grid-cols-4 gap-4 mb-4 p-3 py-4 border-dashed border-3 relative">
                <FormInput
                  control={control}
                  name={`days.${i}.title`}
                  label={`Day ${i + 1} Title`}
                />
                <FormInput
                  control={control}
                  name={`days.${i}.subTitle`}
                  label={`Day ${i + 1} Sub Title`}
                />
                <FormMultiSelect
                  name={`days.${i}.cities`}
                  control={control}
                  label="Select Day Ciities"
                  options={cityOptions || []}
                />
                <FormMultiSelect
                  name={`days.${i}.highlights`}
                  control={control}
                  label="Select Day Highlihts"
                  options={hiValueOptions || []}
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
                <div className="col-span-4">
                  <FormRichText
                    label={`Day ${i + 1} Details`}
                    name={`days.${i}.details`}
                    control={control}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-end bg-white p-4 shadow-md sticky bottom-0">
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

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2" />}
            {initialData ? "Update" : "Add"} Itineraries
          </Button>
        </div>
      </form>
    </Form>
  );
}
