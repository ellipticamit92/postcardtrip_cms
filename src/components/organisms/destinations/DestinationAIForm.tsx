"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDestinations } from "@/hooks/use-destinations";
import { toast } from "sonner";
import { DestinationForm, DestinationFormDataType } from "./DestinationForm";
import { FC, useState } from "react";
import { filterCountry } from "@/lib/helper";
import { FormCheckbox } from "@/components/atoms/FormCheckbox";

const schema = z.object({
  destinationName: z.string().min(1),
  imageChange: z.boolean().optional(),
});

export type DestinationFormAIDataType = z.infer<typeof schema>;

interface DestinationAIFormProps {
  destName?: string;
  destData?: DestinationFormDataType;
  destinationId?: number;
}

export const DestinationAIForm: FC<DestinationAIFormProps> = ({
  destName,
  destData,
  destinationId,
}) => {
  const { createUpdateAIDestination, loading } = useDestinations({
    autoFetch: false,
  });
  const [aiData, setAIData] = useState<Partial<DestinationFormDataType>>(
    destData ?? ({} as Partial<DestinationFormDataType>)
  );

  const form = useForm<DestinationFormAIDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      destinationName: destName || "",
      imageChange: false,
    },
  });

  const { control, watch, setError } = form;
  const destinaionName = watch("destinationName");
  const isImageChanged = watch("imageChange");

  const onSubmit = async (data: DestinationFormAIDataType) => {
    try {
      if (!data.destinationName || data.destinationName.trim() === "") {
        toast.error("Destination name is required");
        return;
      }

      const aiResponseData = await createUpdateAIDestination(
        data.destinationName.trim(),
        !!destinationId,
        data.imageChange || false
      );

      if (aiResponseData.success) {
        setAIData({
          ...destData,
          name: aiResponseData?.data?.name ?? destinaionName,
          heading: aiResponseData?.data?.heading,
          country: filterCountry(aiResponseData?.data?.country ?? ""),
          overview: aiResponseData?.data?.overview ?? "",
          heroTitle: aiResponseData?.data?.heroTitle ?? "",
          text: aiResponseData?.data?.text ?? "",
          isRichText: false,
          bestTimeToVisit: aiResponseData?.data?.bestTimeToVisit ?? "",
          ...(isImageChanged || !destinationId
            ? { imageUrl: aiResponseData?.data?.imageUrl }
            : {}),
        });
      } else {
        setError("destinationName", {
          type: "manual",
          message:
            `${aiResponseData.error}: ${aiResponseData?.details?.[0]?.message}` ||
            "Failed to generate destination",
        });
      }
    } catch (err: any) {
      console.error("Error in generating destination content", err);
      toast.error(err.message || "Error in submitting destination");
      if (err && err.details && err.details.length > 0) {
        const newErrorMessge = "";
        err.details.forEach((detail: any) => {
          newErrorMessge.concat(detail.message, " ");
        });
        setError("destinationName", {
          type: "manual",
          message: newErrorMessge.trim(),
        });
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mb-3">
          <div className="rounded-xl border bg-white dark:bg-gray-900 p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <FormInput
                name="destinationName"
                control={control}
                label="Destination Name"
              />
              <FormCheckbox
                name="imageChange"
                control={control}
                label="Change Image"
              />
              <Button
                variant="default"
                type="submit"
                disabled={loading}
                className="w-full md:w-auto flex items-center justify-center gap-2 rounded-lg font-medium"
              >
                {loading && <Loader2 className="animate-spin h-4 w-4" />}
                {destinationId ? "Update" : "Generate"} AI Destination
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {aiData && Object.keys(aiData).length > 0 && (
        <DestinationForm initialData={aiData} destinationId={destinationId} />
      )}
    </>
  );
};
