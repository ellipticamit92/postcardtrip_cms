"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";
import { FormTextarea } from "@/components/atoms/FormTextarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  country: z.string().min(1),
  description: z.string().min(1),
  overview: z.string().min(1),
  imageUrl: z.string().optional(),
});

export type DestinationFormData = z.infer<typeof schema>;

export function DestinationForm({
  initialData,
}: {
  initialData?: DestinationFormData;
}) {
  const form = useForm<DestinationFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      name: "",
      country: "",
      description: "",
      overview: "",
      imageUrl: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: DestinationFormData) => {
    const res = await fetch(
      `/api/destination${initialData ? `/${initialData.id}` : ""}`,
      {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (res.ok) {
      router.push("/destination");
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput name="name" control={form.control} label="Name" />
        <FormInput name="country" control={form.control} label="Country" />
        <FormTextarea
          name="description"
          control={form.control}
          label="Description"
        />
        <FormTextarea name="overview" control={form.control} label="Overview" />
        <FormInput name="imageUrl" control={form.control} label="Image URL" />
        <Button type="submit">
          {initialData ? "Update" : "Create"} Destination
        </Button>
      </form>
    </Form>
  );
}
