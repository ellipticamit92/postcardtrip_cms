"use client";

import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import { Button } from "@/components/ui/button";
import { FormSelect } from "../atoms/FormSelect";
import { Loader2 } from "lucide-react";
import { FormRichText } from "../atoms/FormRichText";
import { toast } from "sonner";
import ImageUploader from "../atoms/ImageUploader";
import { usePackages } from "@/hooks/use-packages";

const schema = z.object({
  name: z.string().min(1),
  destinationId: z.string().min(1, "Please atleast one number"),
  imageUrl: z.string().optional(),
  description: z.string().min(5, "Package Description is too short"),
  basePrice: z.string().optional(),
  day: z.string().min(1, "Please select day"),
  night: z.string().min(1, "Please select night"),
});

export type PackageFormData = z.infer<typeof schema>;

export function PackageForm({
  destinations,
  initialData,
  PackageId,
}: {
  destinations: { label: string; value: string }[];
  initialData?: PackageFormData;
  PackageId?: number;
}) {
  const { createPackage, updatePackage, loading } = usePackages({
    autoFetch: false,
  });

  const form = useForm<PackageFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      name: "",
      destinationId: destinations?.[0]?.value || "0",
      imageUrl: "",
      description: "",
      day: "",
      night: "",
      basePrice: "",
    },
  });

  const { control, reset } = form;

  const onSubmit = async (data: PackageFormData) => {
    try {
      const isEditMode = Boolean(PackageId);

      const submitData = {
        name: data.name.trim(),
        day: parseInt(data.day),
        night: parseInt(data.night),
        destinationId: parseInt(data.destinationId ?? "1"),
        cityId: 1,
        imageUrl: data.imageUrl ?? "not-url",
        basePrice: parseFloat(data.basePrice ?? "0"),
        description: data.description.trim(),
      };

      if (isEditMode && PackageId) {
        await updatePackage(PackageId, submitData);
      } else {
        await createPackage(submitData);
      }

      if (!isEditMode) {
        reset();
      }
    } catch (err: any) {
      console.error("Error submitting Package", err);
      toast.error(err.message || "Error submitting Package");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-10">
        <div className="grid grid-cols-3 gap-4">
          <FormInput name="name" control={control} label="Package Name" />
          <FormSelect
            label="Destination"
            name="destinationId"
            control={control}
            options={destinations}
            placeholder="Select destination"
          />

          <FormInput
            disabled
            name="imageUrl"
            control={control}
            label="Image URL"
          />

          <FormInput name="day" control={control} label="Package Day" />
          <FormInput name="night" control={control} label="Package Night" />
          <FormInput
            name="basePrice"
            control={control}
            label="Package Base Price"
          />

          <div className="col-span-2">
            <FormRichText
              label="Package Overview"
              name="description"
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
                label="Upload Package Image"
              />
            )}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2" />}
          {initialData ? "Update" : "Add"} Package
        </Button>
      </form>
    </Form>
  );
}
