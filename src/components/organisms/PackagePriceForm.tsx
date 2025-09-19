"use client";

import { Resolver, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import { Button } from "@/components/ui/button";
import { FormSelect } from "../atoms/FormSelect";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Options } from "@/types/type";
import { usePackagePrice } from "@/hooks/use-package-price";

const schema = z.object({
  basePrice: z.coerce.number().positive("Price must be greater than 0"),
  originalPrice: z.coerce.number().positive("Price must be greater than 0"),
  hotelId: z.string().min(1, "Please atleast one number"),
  packageId: z.string().min(1, "Please atleast one number"),
});

export type PackagePriceFormData = z.infer<typeof schema>;

export function PackagePriceForm({
  initialData,
  hotelData,
  packageData,
  packagePriceId,
}: {
  initialData?: PackagePriceFormData;
  hotelData: Options;
  packageData: Options;
  packagePriceId?: number;
}) {
  const { createPackagePrice, updatePackagePrice, loading } = usePackagePrice({
    autoFetch: false,
  });

  const form = useForm<PackagePriceFormData>({
    resolver: zodResolver(schema) as Resolver<PackagePriceFormData>,
    defaultValues: initialData ?? {
      basePrice: 0,
      originalPrice: 0,
      hotelId: String(hotelData?.[0]?.value) || "0",
      packageId: String(packageData?.[0]?.value) || "0",
    },
  });

  const { control, reset } = form;

  const onSubmit = async (data: PackagePriceFormData) => {
    try {
      const isEditMode = Boolean(packagePriceId);

      const submitData = {
        basePrice: data.basePrice,
        originalPrice: data.originalPrice,
        packageId: parseInt(data.packageId ?? 1),
        hotelId: parseInt(data.hotelId ?? 1),
      };

      if (isEditMode && packagePriceId) {
        await updatePackagePrice(packagePriceId, submitData);
      } else {
        await createPackagePrice(submitData);
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
        <div className="grid grid-cols-4 gap-4">
          <FormInput
            name="basePrice"
            type="number"
            control={control}
            label="Base Price"
          />

          <FormInput
            name="originalPrice"
            type="number"
            control={control}
            label="Original Price"
          />

          <FormSelect
            label="Select Package"
            name="packageId"
            control={control}
            options={packageData}
            placeholder="Select packages"
          />

          <FormSelect
            label="Select Hotel"
            name="hotelId"
            control={control}
            options={hotelData}
            placeholder="Select hotel"
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
