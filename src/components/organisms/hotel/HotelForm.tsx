"use client";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useHotels } from "@/hooks/use-hotels";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import { FormSelect } from "@/components/atoms/FormSelect";
import { FormRichText } from "@/components/atoms/FormRichText";
import { StarRating } from "@/components/atoms/StarRating";
import MyForm from "../MyForm";

const hotelSchema = z.object({
  name: z.string().min(2, "Hotel name is required"),
  description: z.string().min(5, "Hotel is too short"),
  starRating: z.number().min(1, "Hotel rating is required"),
  cityId: z.string().min(1, "Please atleast one number"),
});

type HotelFormValues = z.infer<typeof hotelSchema>;

interface HotelFormProps {
  cities: { label: string; value: string }[];
  initialData?: HotelFormValues;
  hotelId?: number;
}

export function HotelForm({ cities, initialData, hotelId }: HotelFormProps) {
  const { loading, createHotel, updateHotel } = useHotels({
    autoFetch: false,
  });
  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      cityId: cities?.[0]?.value || "0",
      starRating: 0,
    },
  });

  const { control, handleSubmit, reset } = form;

  const onSubmit = async (data: HotelFormValues) => {
    try {
      const isEditMode = Boolean(hotelId);

      const submitData = {
        name: data.name.trim(),
        description: data.description.trim(),
        cityId: parseInt(data.cityId),
        starRating: data.starRating,
      };

      if (isEditMode && hotelId) {
        await updateHotel(hotelId, submitData);
      } else {
        await createHotel(submitData);
      }

      if (!isEditMode) {
        reset();
      }
    } catch (err: any) {
      console.error("Error submitting destination", err);
      toast.error(err.message || "Error submitting destination");
    }
  };

  return (
    <MyForm>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <FormInput
              label="Hotel Name"
              name="name"
              placeholder="Enter hotel name"
              control={control}
            />
            <FormSelect
              label="City"
              name="cityId"
              control={control}
              options={cities}
              placeholder="Select City"
            />
            <Controller
              name="starRating"
              control={control}
              render={({ field }) => (
                <StarRating
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  label="Hotel Star Rating"
                />
              )}
            />
          </div>

          <FormRichText
            label="Hotel Description"
            name="description"
            placeholder="Describe hotel details"
            control={control}
          />

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2" />}
            {initialData ? "Update" : "Add"} Hotel
          </Button>
        </form>
      </Form>
    </MyForm>
  );
}
