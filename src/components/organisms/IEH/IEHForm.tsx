"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useIEH } from "@/hooks/use-ieh";
import { IEHType } from "@/types/type";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/atoms/FormInput";

const scheama = z.object({
  text: z.string().min(2, "Text is required"),
});

export type IEHFormValues = z.infer<typeof scheama>;

interface IEHFormProps {
  initialData?: IEHFormValues;
  id?: number;
  type: IEHType;
  handleModalOpen?: () => void;
}

export function IEHForm({
  initialData,
  id,
  type,
  handleModalOpen,
}: IEHFormProps) {
  const { loading, createIEH, updateIEH } = useIEH({
    autoFetch: false,
    type,
  });
  const form = useForm<IEHFormValues>({
    resolver: zodResolver(scheama),
    defaultValues: initialData || {
      text: "",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: IEHFormValues) => {
    try {
      const isEditMode = Boolean(id);

      const submitData = {
        text: data.text.trim(),
      };

      if (isEditMode && id) {
        await updateIEH(id, submitData, type);
      } else {
        await createIEH(submitData, type);
      }

      handleModalOpen && handleModalOpen();
    } catch (err: any) {
      console.error("Error submitting destination", err);
      toast.error(err.message || "Error submitting destination");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div className="grid mb-6">
          <FormInput
            label={`${type} Name`}
            name="text"
            placeholder={`Enter ${type} here...`}
            control={control}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2" />}
          {initialData ? "Update" : "Add"} {type}
        </Button>
      </form>
    </Form>
  );
}
