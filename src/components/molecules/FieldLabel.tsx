import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";

export const FieldLabel = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
}) => (
  <div className="form-item vertical mb-4">
    <Label htmlFor={name}>{label}</Label>
    <Input
      name={name}
      placeholder={placeholder}
      type={type}
      defaultValue={value}
    />
  </div>
);
