"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { FormMultiSelect } from "@/components/atoms/FormMultiSelect";
import { FormRichText } from "@/components/atoms/FormRichText";
import { FormInput } from "@/components/atoms/FormInput";
import { Loader2 } from "lucide-react";
import FormSection from "@/components/molecules/FormSection";
import { useItineraries } from "@/hooks/use-itineraries";
import { itineraryAIResponseType } from "@/app/api/auth/ai-generate/itineraries/route";

/* ---------------------------------------------
 ✅ Zod Schema + Types
--------------------------------------------- */
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
  days: z.array(daySchema).min(1, "At least one day required"),
  packageId: z.number().min(1, "package id  is required"),
});

export type ItinerariesFormData = z.infer<typeof itinerariesSchema>;

/* ---------------------------------------------
 ✅ Props Interface
--------------------------------------------- */
interface ItinerariesFormProps {
  packageId: number;
  initialData?: ItinerariesFormData;
  itineraryId?: number;
  days: itineraryAIResponseType;
}

/* ---------------------------------------------
 ✅ Component
--------------------------------------------- */
export default function ItinerariesForm({
  initialData,
  itineraryId,
  days,
  packageId,
}: ItinerariesFormProps) {
  const { loading, createItinerary } = useItineraries();

  const form = useForm<ItinerariesFormData>({
    resolver: zodResolver(itinerariesSchema),
    defaultValues: initialData ?? {
      days:
        days?.itinerary?.map((d) => ({
          day: d.day,
          title: d.title,
          subTitle: d.subTitle || "",
          details: d.details,
          highlights: d.highlights || [],
          cities: d.cities || [],
        })) ?? [],
      packageId: packageId,
    },
  });

  const { highlights, cities } = days;

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

  /* ---------------------------------------------
  ✅ onSubmit Handler
  --------------------------------------------- */
  const onSubmit = async (data: ItinerariesFormData) => {
    try {
      const submitData = {
        packageId,
        days: data.days,
      };

      // Uncomment when ready to integrate:
      if (itineraryId) {
        //await updateItinerary(itineraryId, submitData);
      } else {
        await createItinerary(submitData);
      }

      toast.success("Itinerary saved successfully!");
    } catch (err: any) {
      console.error("Error submitting itinerary:", err);
      toast.error(err.message || "Error submitting itinerary");
    }
  };

  /* ---------------------------------------------
  ✅ Sync with AI response changes
  --------------------------------------------- */
  useEffect(() => {
    if (days?.itinerary?.length) {
      reset({
        days: days.itinerary.map((d) => ({
          day: d.day,
          title: d.title,
          subTitle: d.subTitle || "",
          details: d.details,
          highlights: d.highlights || [],
          cities: d.cities || [],
        })),
        packageId: packageId,
      });
    }
  }, [days, reset, packageId]);

  /* ---------------------------------------------
  ✅ JSX
  --------------------------------------------- */
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 mt-4 relative"
      >
        {fields.map((field, i) => (
          <FormSection
            key={field.id}
            title={`Day ${field.day}: ${field.title || ""}`}
            icon=""
            className="relative"
          >
            {/* 🏷️ Title */}
            <FormInput
              control={control}
              name={`days.${i}.title`}
              label="Title"
              defaultValue={field.title}
            />

            {/* 🏷️ Sub Title */}
            <FormInput
              control={control}
              name={`days.${i}.subTitle`}
              label="Sub Title"
              defaultValue={field.subTitle}
            />

            {/* 📝 Details */}
            <div className="col-span-4">
              <FormRichText
                label="Details"
                name={`days.${i}.details`}
                control={control}
                defaultValue={field.details}
              />
            </div>

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

            {/* ✨ Highlights */}
            <div className="col-span-2">
              <FormMultiSelect
                label={`Highlights (Day ${i + 1})`}
                name={`days.${i}.highlights`}
                control={control}
                options={highlights ?? []}
                defaultValue={field.highlights ?? []}
              />
            </div>

            {/* 🌆 Cities */}
            <div className="col-span-2">
              <FormMultiSelect
                label={`Cities (Day ${i + 1})`}
                name={`days.${i}.cities`}
                control={control}
                options={cities ?? []}
                defaultValue={field.cities ?? []}
              />
            </div>
          </FormSection>
        ))}

        {/* ➕ Add / Submit Buttons */}
        <div className="flex gap-4 justify-end bg-white p-4 shadow-md sticky bottom-0">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              append({
                day: fields.length > 0 ? fields[fields.length - 1].day + 1 : 1,
                title: "",
                details: "",
                highlights: [],
                cities: [],
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
