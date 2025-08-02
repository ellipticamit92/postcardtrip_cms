"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormInput } from "../atoms/FormInput";
import { FormSelect } from "../atoms/FormSelect";
import { Form } from "../ui/form";
import { Loader2 } from "lucide-react";
import { FormRichText } from "../atoms/FormRichText";

const citySchema = z.object({
  name: z.string().min(2, "City name is required"),
  description: z.string().min(5, "Description is too short"),
  destinationId: z.string().min(1, "Please atleast one number"),
});

type CityFormValues = z.infer<typeof citySchema>;

interface CityFormProps {
  destinations: { label: string; value: string }[];
  initialData?: CityFormValues;
  cityId?: number;
}

export function CityForm({ destinations, initialData, cityId }: CityFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<CityFormValues>({
    resolver: zodResolver(citySchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      destinationId: destinations?.[0]?.value || "0",
    },
  });

  const { control, handleSubmit, reset } = form;

  async function onSubmit(data: CityFormValues) {
    setLoading(true);
    try {
      const res = await fetch(
        cityId ? `/api/auth/city/${cityId}` : `/api/auth/city`,
        {
          method: cityId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Something went wrong");

      toast.success(result.message);
      router.refresh();
      if (!cityId) {
        reset(); // clears form for new entries
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

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
          <FormSelect
            label="Destination"
            name="destinationId"
            control={control}
            options={destinations}
            placeholder="Select destination"
          />
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
