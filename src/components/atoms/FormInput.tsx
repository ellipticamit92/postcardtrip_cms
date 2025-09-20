import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  step?: number | string;
  min?: number;
  max?: number;
}

export const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "",
  type = "text",
  disabled = false,
  step,
  min,
  max,
}: FormInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              type={type}
              disabled={disabled}
              value={field.value ?? ""}
              step={step}
              min={min}
              max={max}
              onChange={(e) =>
                field.onChange(
                  type === "number"
                    ? e.target.value === ""
                      ? undefined
                      : +e.target.value
                    : e.target.value
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
