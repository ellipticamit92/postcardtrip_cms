"use client";

import { useEffect } from "react";
import { Controller, Control, useFormContext } from "react-hook-form";
import { FormRichText } from "../atoms/FormRichText";
import { FormTextarea } from "../atoms/FormTextarea";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface FormSwitchableEditorProps {
  name: string; // overview
  isRichName: string; // isRichText
  control: Control<any>;
  label: string;
  placeholder?: string;
  height?: number;
}

export default function FormSwitchableEditor({
  name,
  isRichName,
  control,
  label,
  placeholder,
  height = 260,
}: FormSwitchableEditorProps) {
  const { setValue, watch } = useFormContext();

  // Watch boolean from form
  const isRichText = watch(isRichName) ?? true;

  useEffect(() => {
    if (isRichText === undefined) {
      setValue(isRichName, true); // default
    }
  }, [isRichText, isRichName, setValue]);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <Tabs
          value={isRichText ? "rich" : "text"}
          onValueChange={(val) => setValue(isRichName, val === "rich")}
        >
          <TabsList className="grid grid-cols-2 w-[160px]">
            <TabsTrigger value="rich">RichText</TabsTrigger>
            <TabsTrigger value="text">Textarea</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* main field */}
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          isRichText ? (
            <FormRichText
              {...field}
              label={label}
              placeholder={placeholder}
              control={control}
              height={height}
            />
          ) : (
            <FormTextarea
              {...field}
              label={label}
              placeholder={placeholder}
              control={control}
              className="h-[210px]"
            />
          )
        }
      />
    </div>
  );
}
