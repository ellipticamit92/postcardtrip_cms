import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import dynamic from "next/dynamic";

// Dynamically import to avoid SSR issues
const TinyMCEEditor = dynamic(() => import("./TinyMCEEditor"), {
  ssr: false,
  loading: () => (
    <div className="border rounded-md p-4 min-h-[200px] bg-gray-50">
      <p className="text-gray-500">Loading editor...</p>
    </div>
  ),
});

interface FormRichTextProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  height?: number;
}

export const FormRichText = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Start writing...",
  height = 400,
}: FormRichTextProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <TinyMCEEditor
              content={field.value || ""}
              onChange={field.onChange}
              height={height}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
