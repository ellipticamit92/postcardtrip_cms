"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ImageUploadField } from "@/components/ImageUploadField";
import { imageSchema } from "@/schemas/imageSchema";

const formSchema = z.object({
  images: imageSchema,
});

export default function UploadForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { images: undefined },
  });

  const onSubmit = (values: any) => {};

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ImageUploadField name="images" />
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </FormProvider>
  );
}
