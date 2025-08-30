"use client";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FormInput } from "../atoms/FormInput";
import { Form } from "../ui/form";
import { Loader2 } from "lucide-react";
import { FormRichText } from "../atoms/FormRichText";
import { useCities } from "@/hooks/use-cities";
import ImageUploader from "../atoms/ImageUploader";

const citySchema = z.object({
  name: z.string().min(2, "City name is required"),
  description: z.string().min(5, "City Description is too short"),
  imageUrl: z.string().optional(),
});

type CityFormValues = z.infer<typeof citySchema>;

interface CityFormProps {
  destinations: { label: string; value: string }[];
  initialData?: CityFormValues;
  cityId?: number;
}

export function CityForm({ destinations, initialData, cityId }: CityFormProps) {
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
      };

      if (isEditMode && cityId) {
        await updateCity(cityId, submitData);
      } else {
        await createCity(submitData);
      }

      if (!isEditMode) {
        //reset();
      }
    } catch (err: any) {
      console.error("Error submitting city", err);
      toast.error(err.message || "Error submitting city");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <FormInput
            label="City Name"
            name="name"
            placeholder="Enter city name"
            control={control}
          />
          {/* <FormSelect
            label="Destination"
            name="destinationId"
            control={control}
            options={destinations}
            placeholder="Select city"
          /> */}
          <FormInput
            disabled
            name="imageUrl"
            control={control}
            label="Image URL"
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
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2" />}
          {initialData ? "Update" : "Add"} City
        </Button>
      </form>
    </Form>
  );
}
