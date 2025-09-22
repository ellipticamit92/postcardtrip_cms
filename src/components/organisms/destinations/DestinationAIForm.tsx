"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDestinations } from "@/hooks/use-destinations";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1),
});

export type DestinationFormAIDataType = z.infer<typeof schema>;

export function DestinationAIForm() {
  const { createAIDestination, loading } = useDestinations({
    autoFetch: false,
  });

  const form = useForm<DestinationFormAIDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const { control } = form;

  const onSubmit = async (data: DestinationFormAIDataType) => {
    try {
      if (!data.name || data.name.trim() === "") {
        toast.error("Destination name is required");
        return;
      }
      await createAIDestination(data.name.trim());
    } catch (err: any) {
      console.error("Error submitting destination", err);
      toast.error(err.message || "Error submitting destination");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mb-12">
        <div className="p-4 px-5 bg-white rounded-2xl shadow-md border border-gray-100 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            📍 Baic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <FormInput name="name" control={control} label="Destination Name" />
          </div>
          <Button
            variant="default"
            type="submit"
            disabled={loading}
            className="px-8 py-3 text-base font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            {loading && <Loader2 className="animate-spin mr-2" />}
            Add Destination
          </Button>
        </div>
      </form>
    </Form>
  );
}
