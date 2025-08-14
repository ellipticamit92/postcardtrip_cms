"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FormInput } from "../atoms/FormInput";
import { FormSelect } from "../atoms/FormSelect";
import { Form } from "../ui/form";
import { Loader2 } from "lucide-react";
import { useIEH } from "@/hooks/use-ieh";
import { IEHType } from "@/types/type";

const scheama = z.object({
  text: z.string().min(2, "Text is required"),
});

type IEHFormValues = z.infer<typeof scheama>;

interface IEHFormProps {
  initialData?: IEHFormValues;
  id?: number;
  type: IEHType;
}

export function IEHForm({ initialData, id, type }: IEHFormProps) {
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

  const { control, handleSubmit, reset } = form;

  const onSubmit = async (data: IEHFormValues) => {
    try {
      const isEditMode = Boolean(id);

      const submitData = {
        text: data.text.trim(),
      };

      console.log("DEBUG submit data = ", submitData);

      let result;
      if (isEditMode && id) {
        console.log("EDIT mode");
        result = await updateIEH(id, submitData, type);
      } else {
        result = await createIEH(submitData, type);
      }

      if (!isEditMode) {
        reset();
      }
    } catch (err: any) {
      console.error("Error submitting destination", err);
      toast.error(err.message || "Error submitting destination");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
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
