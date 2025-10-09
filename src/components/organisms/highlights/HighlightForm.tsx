"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import MyForm from "../MyForm";
import { Options } from "@/types/type";
import FormSection from "@/components/molecules/FormSection";
import { FormSelect } from "@/components/atoms/FormSelect";
import { useHighlights } from "@/hooks/use-highlights";

const highlightSchema = z.object({
  title: z.string().min(2, "Highlight name is required"),
  category: z.string().optional(),
  destinationId: z.number().optional(),
});

export type HighlightFormValues = z.infer<typeof highlightSchema>;

interface HighlightFormProps {
  destinations: Options;
  initialData?: HighlightFormValues;
  hlId?: number;
}

export function HighlightForm({
  initialData,
  hlId,
  destinations,
}: HighlightFormProps) {
  const { loading, createHighlight, updateHighlight } = useHighlights({
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
        destinationId: data?.destinationId,
      };

      if (isEditMode && hlId) {
        await updateHighlight(hlId, submitData);
      } else {
        await createHighlight(submitData);
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
              label="Highlight Name"
              name="title"
              placeholder="Enter highlight name"
              control={control}
            />
            <FormInput
              label="Highlight Category"
              name="category"
              placeholder="Enter highlight category"
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
          </FormSection>

          <div className="flex justify-end bg-white p-4 shadow-md sticky bottom-0">
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-base font-medium"
            >
              {loading && <Loader2 className="animate-spin mr-2" />}
              {initialData ? "Update" : "Add"} Highlight
            </Button>
          </div>
        </form>
      </Form>
    </MyForm>
  );
}
