import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import { MultiSelect } from "../ui/multi-select";

interface FormMultiSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  options: { label: string; value: string }[]; // options array
  variant?: "default" | "secondary" | "destructive" | "inverted";
  /** 🆕 Default selected values (array of strings) */
  defaultValue?: string[];
}

export const FormMultiSelect = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select an option",
  options,
  variant = "default",
  defaultValue = [],
}: FormMultiSelectProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue as any} // ✅ integrate with React Hook Form
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MultiSelect
              options={options}
              value={
                field.value && Array.isArray(field.value)
                  ? field.value
                  : defaultValue
              } // ✅ ensure array type
              onValueChange={field.onChange}
              placeholder={placeholder}
              variant={variant}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
