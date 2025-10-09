"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Options } from "@/types/type";
import { FormSelect } from "@/components/atoms/FormSelect";
import FormSection from "@/components/molecules/FormSection";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DestinationAIDataTYpe,
  destinationAISchema,
} from "@/schemas/destinationName";
import { useHighlights } from "@/hooks/use-highlights";
import { HighlightsAIResponseType } from "@/app/api/auth/ai-generate/highlights/route";

interface HighlightFormProps {
  destinations: Options;
}

export function HighlightAIForm({ destinations }: HighlightFormProps) {
  const [highlightData, sethighlightData] = useState<
    HighlightsAIResponseType[]
  >([]);
  const { loading, createAIHighlights, saveHighlightAIData } = useHighlights({
    autoFetch: false,
  });
  const form = useForm<DestinationAIDataTYpe>({
    resolver: zodResolver(destinationAISchema),
  });

  const { control, handleSubmit, watch, reset } = form;
  const destinationName = watch("destinationName");
  const destinationArr = destinationName?.split("_");
  const destName = destinationArr?.[0];

  const onSubmit = async (data: DestinationAIDataTYpe) => {
    try {
      const destinationArr = data.destinationName.split("_");
      const destName = destinationArr[0];
      const destId = destinationArr[1];
      const submitData = {
        destinationName: destName,
      };

      const resData = await createAIHighlights(submitData);
      const updateData = resData?.data?.map((item: any) => ({
        ...item,
        destinationId: Number(destId),
      }));
      sethighlightData(updateData ?? []);
    } catch (err: any) {
      console.error("Error submitting highlight", err);
      toast.error(err.message || "Error submitting highlight");
    }
  };

  const handleSavehighlight = async () => {
    const res = await saveHighlightAIData(highlightData);
    if (res.success) {
      reset();
      sethighlightData([]);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormSection title="Generate Highlight Data Form" icon="📍">
            <FormSelect
              label="Destination"
              name="destinationName"
              control={control}
              options={destinations}
              placeholder="Select Destination"
            />
            <div className="flex gap-2">
              <div className="flex items-end">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="animate-spin mr-2" />}
                  Generate Higlight Data
                </Button>
              </div>
              {highlightData && highlightData?.length > 0 && (
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleSavehighlight}
                  >
                    {loading && <Loader2 className="animate-spin mr-2" />}
                    Save Highlight Data
                  </Button>
                </div>
              )}
            </div>
          </FormSection>
        </form>
      </Form>

      {highlightData && highlightData?.length > 0 && (
        <FormSection title={`${destName}: highlight data generated`}>
          {highlightData?.map((highlight: HighlightsAIResponseType) => {
            return (
              <Card
                key={highlight.title}
                className="shadow-lg hover:shadow-xl transition-shadow duration-300 py-0"
              >
                <CardContent className="p-2">
                  <CardHeader className="p-0">
                    <CardTitle className="text-lg font-bold">
                      {highlight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardDescription className="text-lg text-muted-foreground mb-3">
                    Category : {highlight.category}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </FormSection>
      )}
    </>
  );
}
