import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Control, FieldValues, Path } from "react-hook-form";

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  options: { label: string; value: string | number }[]; // allow numbers
  isNumber?: boolean; // flag to cast values
}

export const FormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select an option",
  options,
  isNumber = false,
}: FormSelectProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              onValueChange={(val) => field.onChange(isNumber ? +val : val)}
              value={field.value?.toString() ?? ""}
              defaultValue={field.value?.toString() ?? ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map(({ label, value }) => (
                  <SelectItem key={value} value={value.toString()}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
