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
  className?: string;
  /** 🆕 Allows pre-filled value */
  defaultValue?: string | number | undefined;
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
  className = "",
  defaultValue,
}: FormInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue as any} // ✅ prefill support
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              type={type}
              disabled={disabled}
              value={
                field.value ??
                defaultValue ??
                "" /* ensure consistent controlled behavior */
              }
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
              className={className}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
