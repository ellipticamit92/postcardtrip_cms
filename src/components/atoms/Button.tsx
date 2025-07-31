import { Button as ShadButton } from "@/components/ui/button";

export const Button = (props: React.ComponentProps<typeof ShadButton>) => {
  return <ShadButton {...props} className="h-12 rounded-xl w-full" />;
};
