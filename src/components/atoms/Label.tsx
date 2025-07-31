import { Label as ShadLabel } from "@/components/ui/label";

export const Label = (props: React.ComponentProps<typeof ShadLabel>) => {
  return <ShadLabel {...props} className="mb-2" />;
};
