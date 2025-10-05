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
import MyForm from "../MyForm";

const highlightSchema = z.object({
  title: z.string().min(2, "Highlight name is required"),
  category: z.string().optional(),
  destinationId: z.number().optional(),
});

export type HighlightFormValues = z.infer<typeof highlightSchema>;

interface HighlightFormProps {
  destinations: { label: string; value: string }[];
  initialData?: HighlightFormValues;
  hlId?: number;
}

export function HighlightForm({ initialData, hlId }: HighlightFormProps) {
  const { loading, createCity, updateCity } = useCities({
    autoFetch: false,
  });
  const form = useForm<HighlightFormValues>({
    resolver: zodResolver(highlightSchema),
    defaultValues: initialData || {
      title: "",
      category: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  const onSubmit = async (data: HighlightFormValues) => {
    try {
      const isEditMode = Boolean(hlId);

      const submitData = {
        title: data.title.trim(),
        category: data?.category?.trim(),
      };

      console.log("DEBUG submit data  = ", submitData);

      //   if (isEditMode && cityId) {
      //     await updateCity(cityId, submitData);
      //   } else {
      //     await createCity(submitData);
      //   }

      //   if (!isEditMode) {
      //     reset();
      //   }
    } catch (err: any) {
      console.error("Error submitting city", err);
      toast.error(err.message || "Error submitting city");
    }
  };

  return (
    <MyForm>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="col-span-3">
              <FormInput
                label="Highlight Name"
                name="title"
                placeholder="Enter highlight name"
                control={control}
              />
            </div>

            {/* <FormSelect
            label="Destination"
            name="destinationId"
            control={control}
            options={destinations}
            placeholder="Select city"
          /> */}

            {/* <div className="col-span-2">
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
            /> */}
          </div>

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2" />}
            {initialData ? "Update" : "Add"} City
          </Button>
        </form>
      </Form>
    </MyForm>
  );
}
