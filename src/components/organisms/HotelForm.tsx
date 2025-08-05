"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FormInput } from "../atoms/FormInput";
import { FormSelect } from "../atoms/FormSelect";
import { Form } from "../ui/form";
import { Loader2 } from "lucide-react";
import { FormRichText } from "../atoms/FormRichText";
import { useCities } from "@/hooks/use-cities";
import { useHotels } from "@/hooks/use-hotels";

const hotelSchema = z.object({
  name: z.string().min(2, "Hotel name is required"),
  description: z.string().min(5, "Hotel is too short"),
  starRating: z.string().min(1, "Hotel rating is required"),
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
        starRating: parseInt(data.starRating),
      };

      let result;
      if (isEditMode && hotelId) {
        result = await updateHotel(hotelId, submitData);
      } else {
        result = await createHotel(submitData);
      }

      if (!isEditMode) {
        //reset();
      }
    } catch (err: any) {
      console.error("Error submitting destination", err);
      toast.error(err.message || "Error submitting destination");
    }
  };

  // async function onSubmit(data: CityFormValues) {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(
  //       cityId ? `/api/auth/city/${cityId}` : `/api/auth/city`,
  //       {
  //         method: cityId ? "PUT" : "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(data),
  //       }
  //     );

  //     const result = await res.json();

  //     if (!res.ok) throw new Error(result.message || "Something went wrong");

  //     toast.success(result.message);
  //     router.refresh();
  //     if (!cityId) {
  //       reset(); // clears form for new entries
  //     }
  //   } catch (err: any) {
  //     toast.error(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
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
            placeholder="Select destination"
          /> */}
        </div>

        <FormRichText
          label="City Description"
          name="description"
          placeholder="Describe the city"
          control={control}
        />

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2" />}
          {initialData ? "Update" : "Add"} City
        </Button>
      </form>
    </Form>
  );
}
