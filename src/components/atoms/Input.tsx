import { Input as ShadInput } from "@/components/ui/input";

export const Input = (props: React.ComponentProps<typeof ShadInput>) => {
  return <ShadInput {...props} className="h-12" />;
};
