"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import { FormTextarea } from "@/components/atoms/FormTextarea";
import { Button } from "@/components/ui/button";
import { FormSelect } from "../atoms/FormSelect";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { COUNTRIES } from "@/consttants/constant";

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  country: z.string().min(1),
  description: z.string().optional(),
  overview: z.string().min(1),
  imageUrl: z.string().optional(),
});

export type DestinationFormData = z.infer<typeof schema>;

export function DestinationForm({
  initialData,
}: {
  initialData?: DestinationFormData;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<DestinationFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      name: "",
      country: "",
      overview: "",
      imageUrl: "",
    },
  });

  const {
    control,
    formState: { errors },
    reset,
  } = form;

  const onSubmit = async (data: DestinationFormData) => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/destination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to submit note");
      }
      toast.success("Destination added successfully");
      reset();
    } catch (err) {
      console.error("Error submitting note", err);
      toast.error("Error submitting destination");
    } finally {
      setLoading(false);
      reset();
    }
  };

  console.log("DEBUG errors = ", errors);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <FormInput name="name" control={control} label="Destination Name" />
          <FormSelect
            name="country"
            control={control} // from useForm()
            label="Select Country"
            placeholder="Choose your country"
            options={COUNTRIES}
          />

          <FormInput name="imageUrl" control={control} label="Image URL" />
          <div className="col-span-3">
            <FormTextarea name="overview" control={control} label="Overview" />
          </div>
        </div>

        {loading ? (
          <Button disabled>
            <Loader2 /> {initialData ? "Update" : "Add"} Destination
          </Button>
        ) : (
          <Button type="submit">
            {initialData ? "Update" : "Add"} Destination
          </Button>
        )}
      </form>
    </Form>
  );
}
