"use client";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCities } from "@/hooks/use-cities";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import { FormRichText } from "@/components/atoms/FormRichText";
import ImageUploader from "@/components/atoms/ImageUploader";
import MyForm from "../MyForm";
import FormSection from "@/components/molecules/FormSection";
import { FormSelect } from "@/components/atoms/FormSelect";

const citySchema = z.object({
  name: z.string().min(2, "City name is required"),
  description: z.string().min(5, "City Description is too short"),
  imageUrl: z.string().optional(),
  destinationId: z.number().optional(),
});

export type CityFormValues = z.infer<typeof citySchema>;

interface CityFormProps {
  destinations: { label: string; value: string }[];
  initialData?: CityFormValues;
  cityId?: number;
}

export function CityForm({ initialData, cityId, destinations }: CityFormProps) {
  const { loading, createCity, updateCity } = useCities({
    autoFetch: false,
  });
  const form = useForm<CityFormValues>({
    resolver: zodResolver(citySchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  const onSubmit = async (data: CityFormValues) => {
    try {
      const isEditMode = Boolean(cityId);

      const submitData = {
        name: data.name.trim(),
        description: data.description.trim(),
        destinationId: data.destinationId,
      };

      if (isEditMode && cityId) {
        await updateCity(cityId, submitData);
      } else {
        await createCity(submitData);
      }

      if (!isEditMode) {
        reset();
      }
    } catch (err: any) {
      console.error("Error submitting city", err);
      toast.error(err.message || "Error submitting city");
    }
  };

  return (
    <MyForm>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormSection title="Basic Information" icon="📍">
            <FormInput
              label="City Name"
              name="name"
              placeholder="Enter city name"
              control={control}
            />
            <FormSelect
              label="Destination"
              name="destinationId"
              control={control}
              options={destinations}
              placeholder="Select destination"
              isNumber
            />
            <div className="col-span-2">
              <FormRichText
                label="City Description"
                name="description"
                placeholder="Describe the city"
                control={control}
                height={260}
              />
            </div>
            <Controller
              control={control}
              name="imageUrl"
              render={({ field }) => (
                <ImageUploader
                  value={field.value}
                  onChange={field.onChange}
                  label="Upload City Image"
                />
              )}
            />
          </FormSection>

          <div className="flex justify-end bg-white p-4 shadow-md sticky bottom-0">
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-base font-medium"
            >
              {loading && <Loader2 className="animate-spin mr-2" />}
              {initialData ? "Update" : "Add"} City
            </Button>
          </div>
        </form>
      </Form>
    </MyForm>
  );
}
