"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Options } from "@/types/type";
import { useItineraries } from "@/hooks/use-itineraries";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { FormSelect } from "@/components/atoms/FormSelect";
import { Loader2 } from "lucide-react";
import FormSection from "@/components/molecules/FormSection";
import { itineraryAIResponseType } from "@/app/api/auth/ai-generate/itineraries/route";
import ItinerariesForm from "./ItinerariesForm";

const daySchema = z.object({
  day: z.number().min(1, "Day number required"),
  title: z.string().min(1, "Title required"),
  subTitle: z.string().optional(),
  details: z.string().min(1, "Details required"),
  highlights: z.array(z.string()).optional(),
  cities: z.array(z.string()).optional(),
});

export type DaySchemaData = z.infer<typeof daySchema>;

const itinerariesAISchema = z.object({
  packageId: z.number().min(1, "Day number required"),
});

export type ItinerariesAIFormData = z.infer<typeof itinerariesAISchema>;

interface ItinerariesAIFormProps {
  packages: Options;
  initialData?: ItinerariesAIFormData;
  itineraryId?: number;
}

export default function ItinerariesAIForm({
  packages,
}: ItinerariesAIFormProps) {
  const [itiData, setItiData] = useState<itineraryAIResponseType>();
  const { loading, createAIItinerary } = useItineraries();
  const form = useForm<ItinerariesAIFormData>({
    resolver: zodResolver(itinerariesAISchema),
    defaultValues: {},
  });

  const { control, handleSubmit, watch } = form;
  const packageID = watch("packageId");

  const onSubmit = async (data: any) => {
    try {
      const submitData = {
        packageId: data.packageId,
      };

      const resData = await createAIItinerary(submitData);
      setItiData(resData ?? []);
    } catch (err: any) {
      console.error("Error submitting Package", err);
      toast.error(err.message || "Error submitting Package");
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormSection title="Generate Itinerary Data Form" icon="📍">
            <div className="col-span-2">
              <FormSelect
                label="Reviewed Package"
                name="packageId"
                control={control}
                options={packages}
                placeholder="Select package"
                isNumber
              />
            </div>
            <div className="flex items-end ">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="animate-spin mr-2" />}
                Generate Itinerary Data
              </Button>
            </div>
          </FormSection>
        </form>
      </Form>

      {itiData && Object.keys(itiData)?.length > 0 && packageID && (
        <ItinerariesForm days={itiData} packageId={packageID} />
      )}
    </>
  );
}
