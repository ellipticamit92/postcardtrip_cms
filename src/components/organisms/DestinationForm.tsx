"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import { Button } from "@/components/ui/button";
import { FormSelect } from "../atoms/FormSelect";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { COUNTRIES } from "@/consttants/constant";
import { FormRichText } from "../atoms/FormRichText";
import { useDestinations } from "@/hooks/use-destinations";

const schema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  overview: z.string().min(1),
  imageUrl: z.string().optional(),
});

export type DestinationFormData = z.infer<typeof schema>;

export function DestinationForm({
  initialData,
  destinationId,
}: {
  initialData?: DestinationFormData;
  destinationId?: number;
}) {
  const {
    createDestination,
    updateDestination,
    getDestination,
    loading,
    error,
    clearError,
  } = useDestinations({
    autoFetch: false,
  });

  const form = useForm<DestinationFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      name: "",
      country: "",
      overview: "",
      imageUrl: "",
    },
  });

  const { control, reset, setValue } = form;

  const onSubmit = async (data: DestinationFormData) => {
    try {
      const isEditMode = Boolean(destinationId);

      const submitData = {
        name: data.name.trim(),
        country: data.country.trim(),
        overview: data.overview?.trim() || undefined,
        imageUrl: data.imageUrl?.trim() || undefined,
      };

      let result;
      if (isEditMode && destinationId) {
        result = await updateDestination(destinationId, submitData);
      } else {
        result = await createDestination(submitData);
      }

      if (!result.success) {
      }

      console.log("DEBUG submit result  = ", result);
      if (!isEditMode) {
        //reset();
      }
      /*
      const res = await fetch(
        isEditMode
          ? `/api/auth/destination/${id}` // PUT endpoint
          : `/api/auth/destination`, // POST endpoint
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const resData = await res.json();

      console.log("DEBUG fornt resData  = ", resData);

      if (!res.ok || !resData.success) {
        throw new Error(resData.message || "Failed to save destination");
      }

      if (isEditMode) {
        setValue("name", resData?.data?.name ?? "");
        setValue("overview", resData?.data?.overview ?? "");
        setValue("country", resData?.data?.country ?? "");
        setValue("imageUrl", resData?.data?.imageUrl ?? "");
      }

      toast.success(resData.message);
      if (!isEditMode) {
        reset(); // clears form for new entries
      }
      */
    } catch (err: any) {
      console.error("Error submitting destination", err);
      //toast.error(err.message || "Error submitting destination");
    } finally {
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <FormInput name="name" control={control} label="Destination Name" />
          <FormSelect
            name="country"
            control={control}
            label="Select Country"
            placeholder="Choose your country"
            options={COUNTRIES}
          />
          <FormInput name="imageUrl" control={control} label="Image URL" />
          <div className="col-span-3">
            <FormRichText label="Overview" name="overview" control={control} />
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2" />}
          {initialData ? "Update" : "Add"} Destination
        </Button>
      </form>
    </Form>
  );
}
