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
import { OptionsNum } from "@/types/type";
import FormSection from "@/components/molecules/FormSection";

const schema = z.object({
  day: z.number().min(1, "Please select day"),
  night: z.number().min(1, "Please select night"),
  destinationId: z.number().min(1, "Please atleast one number"),
  toursId: z.number().optional(),
  destination: z.string().optional(),
  tourType: z.string().optional(),
});

export type PackageAIFormDataType = z.infer<typeof schema>;

export function PackageAIForm({
  destinations,
  toursOptions,
}: {
  destinations: OptionsNum[];
  toursOptions: OptionsNum[];
}) {
  const { createAIPackage, loading } = usePackages({
    autoFetch: false,
  });

  const form = useForm<PackageAIFormDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      destinationId: Number(destinations?.[0]?.value) ?? 0,
    },
  });

  const { control, reset } = form;

  const onSubmit = async (data: PackageAIFormDataType) => {
    try {
      const destinationName = destinations?.filter(
        (dest) => dest.value === data.destinationId
      );

      const toursName = toursOptions?.filter(
        (tour) => tour.value === data.toursId
      );

      const submitData = {
        day: data.day,
        night: data.night,
        destinationId: Number(data.destinationId) ?? 1,
        toursId: data.toursId ? Number(data.toursId) : undefined,
        destination: destinationName?.[0]?.label ?? "",
        tourType: toursName?.[0]?.label ?? "",
      };

      await createAIPackage(submitData);

      reset();
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
            Add Package
          </Button>
        </FormSection>
      </form>
    </Form>
  );
}
