import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox"; // adjust the import if different
import { Control, FieldValues, Path } from "react-hook-form";

interface FormCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  disabled?: boolean;
}

export const FormCheckbox = <T extends FieldValues>({
  name,
  control,
  label,
  disabled = false,
}: FormCheckboxProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex gap-4">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              ref={field.ref}
              className="border-2 border-black"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
